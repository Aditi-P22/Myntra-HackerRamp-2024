const mongoose = require("mongoose");

const topSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Assuming you store image URL
    required: true,
  },
});

const Top = mongoose.model("Top", topSchema);

module.exports = Top;
