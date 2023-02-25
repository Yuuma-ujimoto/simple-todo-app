import {Request, Response, Router} from "express";

const taskRouter = Router()

taskRouter.get("/",async (req:Request,res:Response)=>{
    // task一覧取得
})

export default taskRouter
