import Product from '../models/productModel.js';
import cloudinary from '../config/cloudinary.js';
import User from '../models/userModel.js';


const createProduct = async (req, res) => {
  try {
    const { 
      ['product-title']: title, category, price, isNegotiable,
      description, condition, ageInYears,
      keywords, 
    } = req.body;

    const imageFiles = req.files; 
   
    
    if (!imageFiles || imageFiles.length === 0) {
      req.flash('Product_error', 'At least one image is required.');
      return res.redirect('/list');
    }

    
       


    
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
        user.listed_product.push(savedProduct._id);  
        await user.save();  
      }
    req.flash('Product_success', 'Product created successfully!');
    
   
    return res.redirect('/list');
 
  } catch (err) {
    req.flash('Product_error', 'Failed to create product: ' + err.message);
    return res.redirect('/list');
  }
};

export default createProduct;
