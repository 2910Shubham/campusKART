import Product from '../models/productModel.js';
import cloudinary from '../config/cloudinary.js';
import User from '../models/userModel.js';

// Create product controller
const createProduct = async (req, res) => {
  try {
    const { 
      ['product-title']: title, category, price, isNegotiable,
      description, condition, ageInYears,
      keywords, 
    } = req.body;

    const imageFiles = req.files; // multer handles multiple files in memory
   
    
    if (!imageFiles || imageFiles.length === 0) {
      req.flash('Product_error', 'At least one image is required.');
      return res.redirect('/list');
    }

    
       


    // Upload images from buffer to Cloudinary
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

    const user = await User.findById(req.user._id);
    
    const seller = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
    };

    // Create and save product
    const newProduct = new Product({
      title,
      category,
      price,
      isNegotiable,
      description,
      condition,
      ageInYears,
      keywords: Array.isArray(keywords)
        ? keywords
        : typeof keywords === 'string'
        ? keywords.split(',').map(k => k.trim())
        : [],
      images: uploadedImages,
      seller,
    });
  
      const savedProduct =  await newProduct.save();
      if (user) {
        user.listed_product.push(savedProduct._id);  // Add the product's ID to the user's listed products
        await user.save();  // Save the updated user document
      }
    req.flash('Product_success', 'Product created successfully!');
    
    // Redirect to appropriate page after success (e.g., product listings or dashboard)
    return res.redirect('/list');
 
  } catch (err) {
    req.flash('Product_error', 'Failed to create product: ' + err.message);
    return res.redirect('/list'); // Redirect back to create form on error
  }
};

export default createProduct;
