const express = require('express');
const router = express.Router();
const multer = require('multer')
const path  = require("path");
const fs = require('fs');
const Image = require('../models/image');
const { v4: uuidv4 } = require('uuid');
const { log } = require('console');

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '_' + Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB file size limit
    }
});

// Route to save edited image from client
router.post('/saveEdit', upload.single('image'), async (req, res) => {
  try {

    
    const { userId , fileName, inputText } = req.body;

    // Create a new image document
    const newImage = new Image({
      imageData: req.file.buffer,
      fileName: fileName + 'editted',
      contentType: req.file.mimetype,
      inputText: inputText,
      userId: userId,
    });

    // Save the updated image to the database
    await newImage.save();

    res.json({ message: 'Image updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update image' });
  }

});

  // Route to save generated images via uploads
  router.post('/upload', upload.single('image'), async (req, res) => {
    try {

      if (!req.file) {
        return res.status(400).json({ error: 'No file was uploaded' });
    }

    // Extract the input text from the request body
    const inputText = req.body.inputText;
    const userId = req.body.userId;

    // Generate a unique identifier
    const uniqueId = uuidv4();

    // Create a unique file name by combining the original file name and the unique identifier
    const uniqueFileName = `${uniqueId}_${req.file.originalname}`;

    console.log('File buffer:', req.file.buffer);
    console.log('Received file:', req.file);
        // Extract image file from the request
        const imageFile = req.file;

        // Create a new image document
        const newImage = new Image({
          imageData: req.file.buffer, // Use req.file.buffer instead of imageFile.buffer
          fileName: uniqueFileName,
          contentType: req.file.mimetype,
          inputText: inputText,
          userId: userId,
      });

        console.log('New Image:', newImage);
        // Save the image to the database
        await newImage.save();

        res.status(201).json({ message: 'Image saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save image' });
    }
});

// Route to retrieve all images of a user
router.get('/gallery/:userId', async (req, res) => {
  try {

    //get token form req params
    const { userId } = req.params;

    // Fetch all images from the database
    const images = await Image.find({userId : userId});

    // Send the list of images as a response
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve images' });
  }
});

// Route to retrieve a specific image by ID
router.get('/:id', async (req, res) => {
  try {

    // Extract image ID from request parameters
    const { id } = req.params;
    // Find the image by ID in the database
    const image = await Image.findById(id);
    // Send the image data as a response
    if (image) {
      res.json(image);
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    console.error('Error retrieving image:', error);
    // Check the error type and return an appropriate error message
    if (error.name === 'CastError') {
      res.status(400).json({ error: 'Invalid image ID' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Route to update an existing image
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    
    // Extract image ID from request parameters
    const { id } = req.params;

    // Find the image by ID in the database
    const existingImage = await Image.findById(id);

    if (!existingImage) {
      return res.status(404).json({ error: 'Image not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file was uploaded' });
    }


    // Update image data
    existingImage.imageData = req.file.buffer;
    existingImage.contentType = req.file.mimetype;

    // Save the updated image to the database
    await existingImage.save();

    res.json({ message: 'Image updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update image' });
  }
});


// Route to delete a specific image by ID
router.delete('/:id', async (req, res) => {
  try {
    // Extract image ID from request parameters
    const { id } = req.params;

    // Find the image by ID and delete it from the database
    const deletedImage = await Image.findByIdAndDelete(id);

    // Send a success response
    if (deletedImage) {
      // Delete the corresponding image file from the server's folder
      const imagePath = path.join(__dirname, '..', deletedImage.imageURL); 
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
        }
      });
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

module.exports = router;