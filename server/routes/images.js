const express = require('express');
const router = express.Router();
const multer = require('multer')
const path  = require("path");
const fs = require('fs');
const Image = require('../models/image');

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname  + '_' + Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage });

  
  // Route to save generated images
  router.post('/', upload.single('image'), async (req, res) => {
    try {
      // Extract image data from request body
      const { description } = req.body;
      const imageURL = req.file.path; 

      // Create a new image document
      const newImage = new Image({
        description,
        imageURL
      });
  
      // Save the image to the database
      await newImage.save();
  
      res.status(201).json({ message: 'Image saved successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save image' });
    }
  });

// Route to retrieve all images
router.get('/', async (req, res) => {
  try {
    // Fetch all images from the database
    const images = await Image.find();

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
    res.status(500).json({ error: 'Failed to retrieve image' });
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
