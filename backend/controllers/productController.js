import {v2 as clodinary} from 'cloudinary';
import Product from '../models/Product.js';

export const addProduct = async (req, res) => {

    try{

        let productData = JSON.parse(req.body.productData);

        const images = req.files;

        let imagesUrl = await Promise.all(
            images.map(async( item ) => {

                let result = await clodinary.uploader.upload(
                    item.path,
                    {
                        resource_type: 'image'
                    }
                );

                return result.secure_url

            })
        )

        await Product.create({
            ...productData, image: imagesUrl
        });

        return res.json({
            success: true,
            message: "Product Added Successfully"
        });

    }
    catch(err){
        return res.json({
            success:false,
            message: err.message
        });
    }
}

export const updateProduct = async (req, res) => {

    try{

        const {id} = req.body;
        
        let productData = JSON.parse(req.body.productData);

        await Product.findByIdAndUpdate(id,{
            ...productData
        });

        return res.json({
            success: true,
            message: "Product Updated Successfully"
        });

    }
    catch(err){
        return res.json({
            success:false,
            message: err.message
        });
    }
}

export const productList = async (req, res) => {

    try{

        const products = await Product.find({});

        return res.json({
            success: true,
            products
        });

    }
    catch(err){
        return res.json({
            success:false,
            message: err.message
        });
    }
}

export const productById = async (req, res) => {

    try{

        const {id} = req.body;

        const product = await Product.findById(id);

        return res.json({
            success: true,
            product
        });

    }
    catch(err){
        return res.json({
            success:false,
            message: err.message
        });
    }
}

export const changeStock = async (req, res) => {

    try{

        const {id, inStock} = req.body;

        const product = await Product.findByIdAndUpdate(id,{
            inStock
        });

        return res.json({
            success: true,
            message: "Product Stock Updated Successfully"
        });

    }
    catch(err){
        return res.json({
            success:false,
            message: err.message
        });
    }
}