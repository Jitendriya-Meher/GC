import Address from "../models/Address.js";

export const addAddress = async ( req, res) => {

    try{

        const {userId} = req;
        const {address} = req.body;

        // console.log('address',address);

        await Address.create({
            ...address,
            userId
        });

        return res.json({
            success: true,
            message: "Address added successfully"
        })

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        })
    }

}

export const getAddress = async ( req, res) => {

    try{

        const {userId} = req;

        const addresses = await Address.find({
            userId
        });

        return res.json({
            success: true,
            addresses
        });

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        })
    }

}