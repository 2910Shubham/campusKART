import express from 'express';
import upload from '../middlewares/multerUpload.js';
import isLoggedin from '../middlewares/isLoggedIn.js';
import createProduct  from '../controllers/productController.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';



const router = express.Router();

router.post('/create',isLoggedin ,upload.array('images[]', 5), createProduct);


router.post('/mark-sold', isLoggedin, async (req, res) => {
    try {
      const { productId } = req.body;
      
      const product = await Product.findById(productId);
      if (!product) {
        console.log('Product not found for ID:', productId);
        return res.status(404).json({ message: 'Product not found.' });
      }
      
      
      product.isSold = true;
      await product.save();
      
     
      const updateResult = await User.findByIdAndUpdate(
        product.seller.id, 
        { $addToSet: { soldProduct: productId } },
        { new: true }  
      );
      
      if (!updateResult) {
        console.log('User not found for ID:', product.seller.id);
        return res.status(404).json({ message: 'Seller not found.' });
      }
      
      console.log('Updated user:', updateResult);
      return res.status(200).json({ message: 'Product marked as sold.' });
    } catch (err) {
      console.error('Error while marking sold:', err);
      return res.status(500).json({ message: 'Server error.' });
    }
  });
  
export default router;



