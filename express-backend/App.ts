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
    origin:"*"
}))


app.use((req, res, next) => {
    console.log(req.path)
    next()
})

import UsersRouter from "./routes/user"
app.use("/users",UsersRouter)

import TaskRouter from "./routes/task";
app.use("/tasks",TaskRouter)


app.listen(3000,()=>{
    console.log("server running")
})
