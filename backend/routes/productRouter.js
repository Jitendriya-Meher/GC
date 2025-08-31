import express from 'express';
import { upload } from '../config/multer.js';
import authSeller from '../middleware/authSeller.js';
import { addProduct, changeStock, productById, productList, updateProduct } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post("/add", upload.array(['images']), authSeller, addProduct);
productRouter.post("/update", upload.none() ,authSeller, updateProduct);
productRouter.get("/list", productList);
productRouter.post("/id", productById);
productRouter.post("/stock", authSeller, changeStock);

export default productRouter;