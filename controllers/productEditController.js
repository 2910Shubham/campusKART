import productModel from "../models/productModel";
import cloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js";
import multer from "multer";



const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

const uploadedImages = await Promise.all(
      imageFiles.map(file => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        });
      })
    );
