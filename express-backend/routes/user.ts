import {Request, Response, Router} from "express";
import {DefaultResponse} from "../Types";
import {getAuth} from "firebase-admin/auth";
import {createConnection} from "mysql2/promise";
import {connectionSetting} from "../config/mysqlSetting";

const router = Router()

router.post("/",async (req:Request,res:Response)=>{
    // ユーザー認証（初回アクセスで登録)

    const {userId=null,userName=null,userIcon=null} = req.body
    if (!userId||!userName||!userIcon){
        res.json({
            ServerError:false,
            ClientError:true,
            ErrorMessage:"パラメーターエラー"
        } as DefaultResponse)
        return
    }

    const Authorization = req.header("Authorization")
    if (!Authorization){
        res.json({
            ServerError:false,
            ClientError:true,
            ErrorMessage:"パラメーターエラー"
        } as DefaultResponse)
        return
    }
    const AccessToken = Authorization.split(" ")[1]
    const connection = await createConnection(connectionSetting)
    try {
        const firebaseUser = await getAuth().verifyIdToken(AccessToken)

        const checkExistUserSQL = "select count(*) as count from users where id = ? and deleted_at is null"
        const [checkExistUserResult,]:any = await connection.query(checkExistUserSQL,[firebaseUser.uid])
        if (!!checkExistUserResult[0].count){
            res.json({
                ServerError:false,
                ClientError:false,
                ErrorMessage:"既に登録済みのユーザーです。"
            }as DefaultResponse)
            return
        }

        const insertUserSQL = "insert into users(id,name,icon) values (?,?,?)"
        await connection.query(insertUserSQL,[firebaseUser.uid,firebaseUser.name,firebaseUser.picture])

        res.json({
            ServerError:false,
            ClientError:false
        } as DefaultResponse)

    }catch (e){
        console.log(e)
        res.json({
            ServerError:true,
            ClientError:false,
            ErrorMessage:"サーバーエラー"
        } as DefaultResponse)
    }

})

export default router
