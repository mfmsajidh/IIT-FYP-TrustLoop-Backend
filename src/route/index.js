import {Router} from "express";
import {authRouter} from "../auth/routes/auth.route.js";
import {postRouter} from "../auth/routes/post.route.js";

const appRouter = Router()

appRouter.use('/authentication',authRouter)
appRouter.use('/post', postRouter)

export default  appRouter
