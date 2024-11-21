import express from "express";
import articleRouter from "./articleRouter.js"
import userRouter from "./userRouter.js"


const router = express.Router();


// J'appelle mes routers
router.use("/articles", articleRouter)
router.use("/users", userRouter)



export default router