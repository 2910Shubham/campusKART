import mongoose from 'mongoose';

const PRODUCT_CATEGORIES = [
  "textbooks",
  "course_notes",
  "electronics",
  "lab_equipment",
  "stationery",
  "calculators",
  "furniture",
  "clothing",
  "sports_equipment",
  "musical_instruments",
  "other"
];

const PRODUCT_CONDITIONS = [
  "new",
  "like_new",
  "good",
  "fair",
  "poor"
];

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: [5, "Title must be at least 5 characters"],
    maxlength: [100, "Title cannot exceed 100 characters"]
  },
  category: {
    type: String,
    enum: PRODUCT_CATEGORIES,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"]
  },
  isNegotiable: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: true,
    minlength: [30, "Description must be at least 30 characters"]
  },
  condition: {
    type: String,
    enum: PRODUCT_CONDITIONS,
    required: true
  },
  ageInYears: {
    type: Number,
    min: 0
  },
  keywords: {
    type: [String],
    default: []
  },
  images: {
    type: [String],
    validate: [arr => arr.length <= 5, "Maximum 5 images allowed"]
  },
  seller: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String
  },
  isSold: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('product', productSchema);
