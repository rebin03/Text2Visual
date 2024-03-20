const mongoose = require("mongoose");


const imageSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model based on the schema
const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
