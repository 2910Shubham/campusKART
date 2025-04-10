import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  department: {
    type: String
  },
  semester: {
    type: String
  },
  roll_number: {
    type: Number,
    required: true,
    unique: true
  },
  whatsapp_number: {
    type: Number
  },
  listed_product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product"
    }
  ],
  image: {
    type: String
  },
  order: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      default: []
    }
  ]
});

export default mongoose.model('user', userSchema);
