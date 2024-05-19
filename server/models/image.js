const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  imageData: { type: Buffer, required: true },
  fileName: { type: String, required: true },
  contentType: { type: String, required: true },
  inputText: { type: String, required: true },
  userId : {type: String, required: true} 
});


// Create a model based on the schema
const Image = mongoose.model("Image", imageSchema);

module.exports = Image;