import {Router} from "express";
import {loginController, registerController} from "../controller/auth.controller.js";

export const authRouter = Router()

authRouter.post('/login', loginController)
authRouter.post('/register', registerController)

