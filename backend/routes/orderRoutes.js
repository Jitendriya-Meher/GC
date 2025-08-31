import express from "express";
import authUser from "../middleware/authUser.js";
import { deleteUserOrders, getAllOrders, getUserOrders, placeOrderCOD, placeOrderStrip, updateOrderStatus } from "../controllers/orderController.js";
import authSeller from "../middleware/authSeller.js";

const orderRouter = express.Router();

orderRouter.post("/cod", authUser, placeOrderCOD);
orderRouter.post("/delete", authUser, deleteUserOrders);
orderRouter.post("/status",authSeller ,updateOrderStatus);
orderRouter.get("/user", authUser, getUserOrders);
orderRouter.get("/seller", authSeller, getAllOrders);
orderRouter.post("/strip", authUser, placeOrderStrip);

export default orderRouter;