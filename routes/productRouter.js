import express from 'express';
import upload from '../middlewares/multerUpload.js';
import isLoggedin from '../middlewares/isLoggedIn.js';
import createProduct  from '../controllers/productController.js';

const router = express.Router();

router.post('/create',isLoggedin ,upload.array('images[]', 5), createProduct);

export default router;
