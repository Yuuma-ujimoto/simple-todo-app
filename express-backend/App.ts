import express, {json, urlencoded} from "express"
import {applicationDefault,initializeApp} from "firebase-admin/app";
import cors from "cors"

initializeApp({
    credential: applicationDefault(),
})

const app = express()
app.use(json())
app.use(urlencoded({extended:true}))
app.use(cors({
    origin:"http://localhost:*"
}))


const AuthUser = async (token:any)=>{
    console.log(token)
}

import UsersRouter from "./Routes/user"
app.use("/users",UsersRouter)


app.listen(3000,()=>{
    console.log("server running")
})
