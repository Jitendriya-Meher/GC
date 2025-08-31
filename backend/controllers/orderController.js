import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe";
import User from "../models/User.js";

export const placeOrderCOD = async ( req, res) => {

    try{

        const {userId} = req;
        const {items, address} = req.body;

        if( !address || items.length === 0){
            return res.json({
                success: true,
                message: "Invalid data"
            })
        }

        let amount = await items.reduce( async (acc,item) => {
            
            const product = await Product.findById(item.product);

            return (await acc) + product.offerPrice * item.quantity ;

        }, 0);

        //add tax
        amount += Math.floor( amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD"
        });

        return res.json({
            success: true,
            message: "Order Placed Successfilly"
        })

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        })
    }

}

export const getUserOrders = async ( req, res) => {

    try{

        const {userId} = req;

        const orders = await Order.find({
            userId,
            $or:[{
                paymentType: "COD"
            },{
                isPaid: true
            }]
        }).populate("items.product address").sort({
            createdAt : -1
        });

        return res.json({
            success: true,
            orders
        })

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        })
    }

}

export const deleteUserOrders = async ( req, res) => {

    try{

        const {id} = req.body;

        const order = await Order.findById(id);

        if( order.status == "Delivered"){
            return res.json({
                success: false,
                message: "Order Already Delivered",
            })
        }

        await Order.findByIdAndDelete(id);

        return res.json({
            success: true,
            message: "Order Deleted Successfully",
        })

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        })
    }

}

export const updateOrderStatus = async (req, res) => {

    try {

        const {orderId , status} = req.body;

        const order = await Order.findById(orderId);

        if( order.status == "Delivered"){
            return res.json({
                success: false,
                message: "Order Already Delivered",
            })
        }

        await Order.findByIdAndUpdate( orderId, {
            status
        });

        return res.json({
            message: "Order Status updated",
            success: true
        })
        
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }

}

export const getAllOrders = async ( req, res) => {

    try{

        const orders = await Order.find({
            $or:[{
                paymentType: "COD"
            },{
                isPaid: true
            }]
        }).populate("items.product address").sort({
            createdAt : -1
        });

        return res.json({
            success: true,
            orders
        })

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        })
    }

}

export const placeOrderStrip = async ( req, res) => {

    try{

        const {userId} = req;
        const {items, address} = req.body;

        const {origin} = req.headers;

        if( !address || items.length === 0){
            return res.json({
                success: true,
                message: "Invalid data"
            })
        }
        
        let productData = [];

        let amount = await items.reduce( async (acc,item) => {
            
            const product = await Product.findById(item.product);

            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity
            });

            return (await acc) + product.offerPrice * item.quantity ;

        }, 0);

        //add tax
        amount += Math.floor( amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online"
        });

        // strip gateway initialize
        const stripInstance = new stripe(
            process.env.STRIP_SECRET_KEY
        );

        // craete line item
        const lineItems = productData.map((item) => {
            return {
                price_data: {
                    currency : "usd",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) *100
                },
                quantity: item.quantity
            }
        });

        // craete session
        const session = await stripInstance.checkout.sessions.create({
            line_items: lineItems,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata:{
                orderId: order._id.toString(),
                userId
            }
        });

        return res.json({
            success: true,
            url: session.url
        })

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        })
    }

}

// verify payment
export const stripWebHook = async (req, res) => {

    try {

        const stripInstance = new stripe(
            process.env.STRIP_SECRET_KEY
        );

        const sig = req.headers['strip-signature'];

        let event;

        event = stripInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIP_WEBHOOK_SECRET
        );

        switch (event.type) {

            case "payment_intent.succeeded":{

                const paymentIntent = event.data.object;

                const paymentIntentId = paymentIntent.id;

                const session = await stripInstance.checkout.session.list({
                    payment_intent : paymentIntentId
                });

                const {orderId, userId} = session.data[0].metadata;

                await Order.findByIdAndUpdate(
                    userId,{
                        isPaid: true
                    }
                );

                await User.findByIdAndUpdate(
                    userId,{
                        cartItems:{}
                    }
                );

                break;
            }
            
            case "payment_intent.payment_failed" : {

                const paymentIntent = event.data.object;

                const paymentIntentId = paymentIntent.id;

                const session = await stripInstance.checkout.session.list({
                    payment_intent : paymentIntentId
                });

                const {orderId} = session.data[0].metadata;

                await Order.findByIdAndDelete(orderId);

                break;
            }   
        
            default:{
                console.log("Unhandled event type");
                break;
            }
                
        }

        res.json({
            received: true
        });
        
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }

}