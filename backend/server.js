import express from "express"
import 'dotenv/config';
import cookieParser from "cookie-parser";
import cors from 'cors';
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import sellerRouter from "./routes/sellerRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRoutes.js";
import addressRouter from "./routes/addressRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import { stripWebHook } from "./controllers/orderController.js";

const app = express();

const PORT = process.env.PORT || 4000;

const allowedOrigins = ['http://localhost:4000','http://loca zlhost:5173',];

app.post("/strip", express.raw({
    type: 'application/json'
}),
stripWebHook);

// middleware
app.use( express.json());
app.use( cookieParser());
app.use( cors({
    origin: allowedOrigins,
    credentials: true
}));

// db
await connectDB();
await connectCloudinary();

// routes
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

app.get("/", (req,res) => {
    res.send("API Working");
});

app.listen( PORT, () => {
    console.log("Server is running on port",PORT);
})