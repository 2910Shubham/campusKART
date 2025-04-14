import userModel from '../models/userModel.js';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';


const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
});


export const uploadProfileImages = upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]);


export const getProfileUpdatePage = async (req, res) => {
  try {
    
    const userId = req.user._id;
    const user = await userModel.findById(userId);
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/user/profile');
    }
    

    const userData = {
      fullname: user.fullname,
      email: user.email,
      department: user.department || '',
      year: user.semester || '', 
      bio: user.bio || '',
      image: user.profile_pic || '/images/profile.png',
      coverImage: user.cover_pic || '/images/cover.png',
      contact: user.whatsapp_number || '',
    };
    
   
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


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bio, department, semester, contact } = req.body;
    
    
    const updateData = {
      bio,
      department,
      semester: semester, 
      whatsapp_number: contact 
    };
    
    const files = req.files;
    
   
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
    
   
    await userModel.findByIdAndUpdate(userId, updateData, { new: true });
    
    req.flash('success', 'Profile updated successfully');
    return res.redirect('/user/profile');
  } catch (error) {
    console.error('Error in updateProfile:', error);
    req.flash('error', 'Something went wrong. Please try again.');
    return res.redirect('/user/profile/update');
  }
};


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