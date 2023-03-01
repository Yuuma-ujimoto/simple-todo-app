import {Request, Response, Router} from "express";
import {createConnection} from "mysql2/promise";
import {connectionSetting} from "../config/mysqlSetting"
import {AuthToken} from "../components/AuthToken";
import {AuthTokenResult, DefaultResponse} from "../Types";
const taskRouter = Router()

//　各APIの返り値の型はRouteファイル内のみで扱うのでType.tsから切り離す

type SelectTaskListResult = DefaultResponse & {
    TaskList:Array<any>
}


taskRouter.get("/",async (req:Request,res:Response)=>{
    // task一覧取得
    const authorization = req.header("authorization")
    if (!authorization){
        res.json({result:false})
        return
    }
    const firebaseToken = authorization.split(" ")[1]
    const AuthResult:AuthTokenResult = await AuthToken(firebaseToken)
    if (!AuthResult.success){
        res.json({
            ServerError:false,
            ClientError:true,
            ErrorMessage:"認証エラー"
        } as DefaultResponse)
        return
    }
    const userId = AuthResult.userId

    const connection = await createConnection(connectionSetting)
    try {
        const selectTaskListSQL = "select id from tasks where user_id = ? and deleted_at is null"
        const [selectTaskListResult,]:any = await connection.query(selectTaskListSQL,[userId])
        res.json({
            ServerError:false,
            ClientError:false,
            TaskList:selectTaskListResult
        } as SelectTaskListResult)
    }catch (e){

    }finally {
        await connection.end()
    }
})


taskRouter.post("/",async (req:Request,res:Response)=>{
    // task登録
    const authorization = req.header("authorization")
    if (!authorization){
        res.json({result:false})
        return
    }
    const firebaseToken = authorization.split(" ")[1]
    const AuthResult:AuthTokenResult = await AuthToken(firebaseToken)
    if (!AuthResult.success){
        res.json({
            ServerError:false,
            ClientError:true,
            ErrorMessage:"認証エラー"
        } as DefaultResponse)
        return
    }
    const userId = AuthResult.userId

})
export default taskRouter
