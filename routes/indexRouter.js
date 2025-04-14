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


//Logout route

router.get('/logout', (req, res) => {
  res.clearCookie('token'); 
  // res.send('success', 'You have been logged out.');
  res.redirect('/');
});

// Search Route
router.get('/search', isLoggedin, async (req, res) => {
  try {
    const keyword = req.query.keyword || '';  
    const selectedCategory = req.query.category || 'All'; 

    let products;


    if (keyword) {
      products = await Product.find({
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ],
        ...(selectedCategory && selectedCategory !== 'All' ? { category: selectedCategory } : {}),
      }).populate('seller.id', 'fullname profile_pic whatsapp_number').lean();
    } else if (selectedCategory && selectedCategory !== 'All') {
      
      products = await Product.find({ category: selectedCategory }).populate('seller.id', 'fullname profile_pic whatsapp_number').lean();
    } else {
     
      products = await Product.find({}).populate('seller.id', 'fullname profile_pic whatsapp_number').lean();
    }

    
    const user = {
      fullname: req.user.fullname,
      bio: req.user.bio,
      image: req.user.profile_pic || '/images/profile.png',
      department: req.user.department || '',
      semester: req.user.semester || '',
      coverImage: req.user.cover_pic || '/images/cover.png',
      contact: req.user.whatsapp_number || '',
    };

   
    res.render('home', { products, user, selectedCategory, keyword });
  } catch (err) {
    console.error("Error occurred while fetching products:", err);
    res.status(500).send("Server Error: " + err.message);
  }
});

// Product Profile Route
router.get("/product/:id", isLoggedin, async function (req, res) {
  try {
    const productId = req.params.id;

   
    const product = await Product.findById(productId)
      .populate('seller.id', 'fullname profile_pic whatsapp_number soldProduct department semester')
      .lean();

    if (!product) {
      return res.status(404).send('Product not found');
    }

    
    const suggestedProducts = await Product.find({
      category: product.category,
      _id: { $ne: productId }
    }).limit(4).lean();

    let user = null;
    if (req.user) {
      user = await User.findById(req.user._id);
    }

    const userData = user ? {
      fullname: user.fullname,
      bio: user.bio,
      image: user.profile_pic || '/images/profile.png',
      department: user.department || '',
      semester: user.semester || '',
      coverImage: user.cover_pic || '/images/cover.png',
      contact: user.whatsapp_number || '',
    } : {
      fullname: 'Guest User',
      bio: 'Welcome to our platform!',
      image: '/images/profile.png',
      department: '',
      semester: '',
      coverImage: '/images/cover.png',
      contact: '',
    };
       
    
    res.render('product', { product, user: userData, suggestedProducts });
  } catch (err) {
    console.error("Error fetching product details:", err);
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
    const selectedCategory = req.query.category || 'All'; 
    const keyword = req.query.keyword || '';  

    let products;

    
    if (keyword) {
      products = await Product.find({
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ],
        ...(selectedCategory && selectedCategory !== 'All' ? { category: selectedCategory } : {}),
      }).populate('seller.id', 'fullname profile_pic whatsapp_number').lean();
    } else if (selectedCategory && selectedCategory !== 'All') {
      
      products = await Product.find({ category: selectedCategory }).populate('seller.id', 'fullname profile_pic whatsapp_number').lean();
    } else {
      
      products = await Product.find({}).populate('seller.id', 'fullname profile_pic whatsapp_number').lean();
    }

    let otherProducts = [];
    if (selectedCategory && selectedCategory !== 'All' && products.length === 0) {
     
      otherProducts = await Product.find({ category: { $ne: selectedCategory }, isSold: false })
        .limit(4)
        .populate('seller.id', 'fullname profile_pic whatsapp_number')
        .lean();
    }

   
    const user = {
      fullname: req.user.fullname,
      bio: req.user.bio,
      image: req.user.profile_pic || '/images/profile.png',
      department: req.user.department || '',
      semester: req.user.semester || '',
      coverImage: req.user.cover_pic || '/images/cover.png',
      contact: req.user.whatsapp_number || '',
    };

    
    res.render('home', { products, user, selectedCategory, otherProducts, keyword });
  } catch (err) {
    console.error("Error occurred while fetching products:", err);
    res.status(500).send("Server Error: " + err.message);
  }
});




export default router;