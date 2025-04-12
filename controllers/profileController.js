import userModel from '../models/userModel.js';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';

// Configure multer for memory storage (needed for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware for profile image and cover image uploads
export const uploadProfileImages = upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]);

// Get profile update page
export const getProfileUpdatePage = async (req, res) => {
  try {
    // Get user profile data
    const userId = req.user._id;
    const user = await userModel.findById(userId);
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/user/profile');
    }
    
    // Prepare user data for frontend - map semester to year for consistency
    const userData = {
      fullname: user.fullname,
      email: user.email,
      department: user.department || '',
      year: user.semester || '', // Map semester to year for frontend
      bio: user.bio || '',
      image: user.profile_pic || '/images/profile.png',
      coverImage: user.cover_pic || '/images/cover.png',
      // Don't send sensitive data like whatsapp_number to frontend
    };
    
    // Render the profile update page with user data
    return res.render('profile-update', {
      user: userData,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error in getProfileUpdatePage:', error);
    req.flash('error', 'Something went wrong. Please try again.');
    return res.redirect('/user/profile');
  }
};

// Handle profile update form submission
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bio, department, semester, contact } = req.body;
    
    // Prepare update data - keep field names consistent with database schema
    const updateData = {
      bio,
      department,
      semester: semester, // Store frontend 'year' value in database 'semester' field
      whatsapp_number: contact // Store frontend 'contact' value in database 'whatsapp_number' field
    };
    
    // Handle file uploads if any
    const files = req.files;
    
    // Upload profile picture if provided
    if (files && files.profilePicture && files.profilePicture.length > 0) {
      try {
        const profilePicture = files.profilePicture[0];
        const profilePictureResult = await uploadToCloudinary(profilePicture, 'profile_pictures');
        updateData.profile_pic = profilePictureResult;
      } catch (uploadError) {
        console.error('Error uploading profile picture:', uploadError);
        req.flash('error', 'Failed to upload profile picture');
      }
    }
    
    // Upload cover image if provided
    if (files && files.coverImage && files.coverImage.length > 0) {
      try {
        const coverImage = files.coverImage[0];
        const coverImageResult = await uploadToCloudinary(coverImage, 'cover_images');
        updateData.cover_pic = coverImageResult;
      } catch (uploadError) {
        console.error('Error uploading cover image:', uploadError);
        req.flash('error', 'Failed to upload cover image');
      }
    }
    
    // Update user in database
    await userModel.findByIdAndUpdate(userId, updateData, { new: true });
    
    req.flash('success', 'Profile updated successfully');
    return res.redirect('/user/profile');
  } catch (error) {
    console.error('Error in updateProfile:', error);
    req.flash('error', 'Something went wrong. Please try again.');
    return res.redirect('/user/profile/update');
  }
};

// Helper function to upload files to Cloudinary
const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(file.buffer);
  });
}; 