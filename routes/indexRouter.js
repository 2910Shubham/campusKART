import express from "express";
const router = express.Router();
import isLoggedin from "../middlewares/isLoggedIn.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import multer from "multer";


// Login and Register Routes

router.get("/", (req, res) => {
  res.render("index", {
    messages: {
      error: req.flash("error"),
      R_error: req.flash("R_error"),
      R_success: req.flash("R_success"),
      logError: req.flash("logError")
    }
  });
});


// Product Profile Route

router.get("/product/:id", async function (req, res) {

  try {
    const productId = req.params.id;
    
    // Fetch the product details using the product ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send('Product not found');
    }

    // Fetch other products from the same category for suggestions
    const suggestedProducts = await Product.find({
      category: product.category,
      _id: { $ne: productId } // Exclude the current product
    }).limit(4); // Limit to 4 suggestions, you can adjust as needed

    const user = {
      fullname: req.user.fullname,
      bio: req.user.bio,
      image: req.user.profile_pic || '/images/profile.png',
      department: req.user.department || '',
      semester: req.user.semester || '',
      coverImage: req.user.cover_pic || '/images/cover.png',
      contact: req.user.whatsapp_number || '',
    };

    res.render('product-profile', { product, user, suggestedProducts });

  } catch (err) {
    console.error("Error occurred while fetching product details:", err);
    res.status(500).send("Server Error: " + err.message);
  }
});


// Product Listing Route

router.get('/list', isLoggedin, function (req, res) {
  const successMsg = req.flash('Product_success');
  const errorMsg = req.flash('Product_error');

  const user = {
    fullname: req.user.fullname,
    bio: req.user.bio,
    image: req.user.profile_pic || '/images/profile.png',
    department: req.user.department || '',
    semester: req.user.semester || '',
    coverImage: req.user.cover_pic || '/images/cover.png',
  };


  res.render('list-product', {
    success: successMsg.length > 0 ? successMsg[0] : null,
    error: errorMsg.length > 0 ? errorMsg[0] : null, user
  });
})


// Home Route

router.get('/home', isLoggedin, async (req, res) => {
  try {
    const selectedCategory = req.query.category || 'All'; // Default to 'All' if no category is selected

    let products;

    if (selectedCategory && selectedCategory !== 'All') {
      products = await Product.find({ category: selectedCategory }).populate('seller.id', 'fullname profile_pic whatsapp_number').lean();
    } else {
      products = await Product.find({}).populate('seller.id', 'fullname profile_pic whatsapp_number').lean();
    }

    let otherProducts = [];
    if (selectedCategory && selectedCategory !== 'All' && products.length === 0) {
      otherProducts = await Product.find({ category: { $ne: selectedCategory }, isSold: false }).limit(4).populate('seller.id', 'fullname profile_pic whatsapp_number').lean();
    }

    // Reuse the same format as in the profile route
    const user = {
      fullname: req.user.fullname,
      bio: req.user.bio,
      image: req.user.profile_pic || '/images/profile.png',
      department: req.user.department || '',
      semester: req.user.semester || '',
      coverImage: req.user.cover_pic || '/images/cover.png',
      contact: req.user.whatsapp_number || '',
    };

    res.render('home', { products, user, selectedCategory, otherProducts });
  } catch (err) {
    console.error("Error occurred while fetching products:", err);
    res.status(500).send("Server Error: " + err.message);
  }
});




export default router;