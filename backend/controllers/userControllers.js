import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const register = async (req, res) => {

    try{

        const {name, email, password} = req.body;

        if( !email || !name || !password){
            return res.json({
                success: false,
                message: "Missing Details"
            });
        }

        const existingUser = await User.findOne({
            email
        });

        if( existingUser){
            return res.json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword, 
        });

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,{
                expiresIn: '7d'
            }
        );

        res.cookie('token', token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7*24*60*60*1000
        });

        return res.json({
            success: true,
            message: "User created successfully",
            user:{
                emil: user.email,
                name: user.name,
                cartItems: user.cartItems
            }
        });

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }

}

export const login = async (req, res) => {

    try{

        const {email, password} = req.body;

        if( !email || !password){
            return res.json({
                success: false,
                message: "Missing Details"
            });
        }

        const user = await User.findOne({
            email
        });

        if( !user){
            return res.json({
                success: false,
                message: "User doesn't exists"
            });
        }

        const isMatch = await bcrypt.compare( password, user.password );

        if( !isMatch){
            return res.json({
                success: false,
                message: "Incorrect Password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,{
                expiresIn: '7d'
            }
        );

        res.cookie('token', token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7*24*60*60*1000
        });

        return res.json({
            success: true,
            message: "User login successfully",
            user:{
                emil: user.email,
                name: user.name,
                cartItems: user.cartItems
            }
        });

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }

}

export const isAuth = async (req, res) => {

    try{

        const {userId} = req;

        const user = await User.findById(userId).select("-password");
        
        return res.json({
            success: true,
            user
        }); 
        
    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }
    
}

export const logout = async (req, res) => {

    try{

        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
        });
        
        return res.json({
            success: true,
            message: "Logout successfuly"
        }); 
        
    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }
    
}

export const sendResetOtp = async ( req, res) => {

    try{

        const {email} = req.body;

        if( !email ){
            return res.json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findOne({
            email: email
        });

        if( !user){
            return res.json({
                success: false,
                message: "User not Found",
            })
        }

        const otp = Math.floor( 100000 + Math.random()*90000);

        user.resetOtp = otp;
        user.resetOtpExpiredAt = Date.now() + 15  * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP for resetting your password is ${otp}. Use this OTP to reset your password within 15 minutes.`,
            // html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }

        await transporter.sendMail( mailOptions);

        return res.json({
            success: true,
            message: "Reset OTP Send on Email"
        });

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }

}

export const resetPassword = async ( req, res) => {

    try{

        const {email, otp, newPassword} = req.body;

        if( !email || !otp || !newPassword ){
            return res.json({
                success: false,
                message: "Missing Details"
            })
        }

        const user = await User.findOne({
            email: email
        });

        if( !user ){
            return res.json({
                success: false,
                message: "User Not Found"
            });
        }

        if( user.resetOtp === "" || user.resetOtp != otp ){
            return res.json({
                success: false,
                message: "Invaild OTP",
            })
        }

        if( user.resetOtpExpiredAt < Date.now() ){
            return res.json({
                success: false,
                message: "OTP Expired",
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpiredAt = 0;

        await user.save();

        return res.json({
            success: true,
            message: "Password Reset Successfully",
        });
        
    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }

}

export const updateProfile = async(req, res) => {

    try{

        const {userId} = req;
        const {name, email} = req.body;

        await User.findByIdAndUpdate(userId, {
            name,
            email
        });

        return res.json({
            success: true,
            "message": "User Updated successfully"
        });

    }
    catch(err){

        return res.json({
            success: false,
            message: err.message
        });

    }
}

export const changePassword = async (req, res) => {
    try {

        const {oldPassword, newPassword} = req.body;
        const id = req.userId;

        if( !oldPassword || !newPassword ){
            return res.json({
                message: "Please fill in all fields", 
                success: false
            });
        }

        const user = await User.findById( id );

        // console.log('user',user);

        const isMatch = await bcrypt.compare( oldPassword ,user.password);

        if( !isMatch){
            return res.json({
                message: "Please enter your correct old password", 
                success: false
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.save();

        return res.json({
            success: true,
            message: "Password Updated Successfully"
        });

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }
}

export const dashboard = async (req, res) => {

    try{

        const orders = await Order.find({
        }).populate("items.product address").sort({
            createdAt : -1
        });

        const confirmOrder = orders.filter((order) => (order.status === "Delivered"));

        const pendingOrders = orders.filter((order) => (order.status !== "Delivered"));

        const products = await Product.find({});

        const monthlyRevenue = confirmOrder.reduce((acc, order) => acc + order.amount, 0);

        const dashboardData = {
            totalOrders: orders.length,
            pendingOrders: pendingOrders.length,
            confirmOrder: confirmOrder.length,
            totalProducts: products.length,
            recentOrders: orders.slice(0,5),
            monthlyRevenue
        }
        
        return res.json({
            success: true,
            dashboardData
        }); 
        
    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }
    
}