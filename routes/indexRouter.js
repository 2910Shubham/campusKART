import express from "express";
const router = express.Router();
import isLoggedin from "../middlewares/isLoggedIn.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import multer from "multer";


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



router.get('/list', isLoggedin, function(req, res){
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


    res.render('list-product', {success: successMsg.length > 0 ? successMsg[0] : null,
      error: errorMsg.length > 0 ? errorMsg[0] : null, user});
})

router.get('/home', isLoggedin, async (req, res) => {
  try {
    const products = await Product.find()
      .populate('seller.id', 'fullname profile_pic whatsapp_number')
      .lean();

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

    res.render('home', { products, user });
  } catch (err) {
    console.error("Error occurred while fetching products:", err);
    res.status(500).send("Server Error: " + err.message);
  }
});




export default router;