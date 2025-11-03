const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  mrpPrice: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  discountPercent: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: false,
    default: "Multicolor",
  },
  images: {
    type: [String],
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  // Toy-specific attributes
  ageGroup: {
    type: String,
    required: false,
    default: "All Ages",
  },
  material: {
    type: String,
    required: false,
    default: "Plastic",
  },
  safetyCertification: {
    type: String,
    required: false,
    default: "CE Certified",
  },
  batteryRequired: {
    type: Boolean,
    required: false,
    default: false,
  },
  brand: {
    type: String,
    required: false,
    default: "Generic",
  },
  // Keep size as optional for backwards compatibility but not required
  size: {
    type: String,
    required: false,
    default: "Standard",
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
