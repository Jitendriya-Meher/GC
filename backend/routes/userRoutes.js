import express from "express";
import { changePassword, dashboard, isAuth, login, logout, register, resetPassword, sendResetOtp, updateProfile } from "../controllers/userControllers.js";
import authUser from "../middleware/authUser.js";
import authSeller from "../middleware/authSeller.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/is-auth", authUser ,isAuth);
userRouter.get("/logout", authUser ,logout);
userRouter.get("/dashboard", authSeller ,dashboard);

userRouter.post("/send-reset-otp", sendResetOtp);
userRouter.post("/reset-password", resetPassword);

userRouter.post("/update", authUser, updateProfile);
userRouter.post("/change-password", authUser ,changePassword);

export default userRouter;
