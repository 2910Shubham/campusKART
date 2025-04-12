import express from "express";
const router = express.Router();
import { registerUser, loginUser } from '../controllers/authController.js';
import isLoggedin from "../middlewares/isLoggedIn.js";  
import User from "../models/userModel.js";  
import { getProfileUpdatePage, updateProfile, uploadProfileImages } from "../controllers/profileController.js";


router.get('/profile', isLoggedin, async (req, res) => {
    try {

      const user = await User.findById(req.user.id)
      .populate('listed_product soldProduct')  // Populate the listed products
      .exec();
      
      const totalListedItems = user.listed_product.length;
      const soldProduct = user.soldProduct.length;

      const totalEarnings = user.soldProduct.reduce((total, product) => {
        return total + (product.price || 0); // Adding null check for price
      }, 0);

      const userData = {
        fullname: req.user.fullname,
        bio: req.user.bio,
        image: req.user.profile_pic || '/images/profile.png',
        department: req.user.department || '',
        semester: req.user.semester || '',
        coverImage: req.user.cover_pic || '/images/cover.png',
        listedProduct: user.listed_product || [],
        totalListedItems: totalListedItems,
        soldProduct: soldProduct,
        totalEarnings: totalEarnings,
      };
  
      res.render('profile', { user: userData });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      req.flash('error', 'Failed to load profile');
      res.redirect('/login');
    }
  });
  

router.get('/profile/update', isLoggedin, getProfileUpdatePage);

// ✅ Handle update form submission (with image uploads)
router.post('/profile/update', isLoggedin, uploadProfileImages, updateProfile);



router.post('/register', registerUser);


router.post('/login', loginUser);

export default router;