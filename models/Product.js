const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    trim: true,
    maxlength: [100, "Name can not be more than 100 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please provide price"],
    default: 0,
  },
  image: {
type: String,
    required: [true, "Please provide image"],
  },
});

module.exports = mongoose.model("Product", ProductSchema);
