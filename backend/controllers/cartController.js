import User from "../models/User.js";

export const updateCart = async ( req, res) => {

    try{

        const {userId} = req;
        const {cartItems} = req.body;

        await User.findByIdAndUpdate( userId, {
            cartItems
        });

        return res.json({
            success: true,
            message: "Cart Updated"
        })

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        })
    }

}