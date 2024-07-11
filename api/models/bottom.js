const mongoose = require("mongoose");

const bottomSchema = new mongoose.Schema({
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

const Bottom = mongoose.model("Bottom", bottomSchema);

module.exports = Bottom;
