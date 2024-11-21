import express from "express";
import { register, login, resetPassword, checkUser} from "../controllers/userController.js"
import {isLogged, isAuthorized } from "../middlewares/auth.js"
const userRouter = express.Router();

// Ma routes commence par 

userRouter.get("/check", isLogged, checkUser)
userRouter.put("/reset-password", isLogged, isAuthorized(["admin", "user"]), resetPassword)
userRouter.post("/login", login)
userRouter.post("/register", register)

export default userRouter;