import {Router} from "express";
import {authRouter} from "../auth/routes/auth.route.js";

const appRouter = Router()

appRouter.use('/authentication',authRouter)

export default  appRouter
