import axios from "axios";
import {auth} from "../plugins/firebase";
import {getAuth} from "@firebase/auth";

type AccessMethod = "get" | "post" | "put" | "delete"

type CallAPIResult = {
    success: boolean,
    responseData?: any
}

const BaseURL = "http://localhost:3000"

export class CallAPI {
    private axiosURL: string = ""
    private useAuth: boolean = false
    public requestData: any = {}

    private success: boolean = false

    private responseData: any = {}

    // public > static > asyncの順番じゃないとダメっぽい

    public static async access(
        endPoint: string,
        method: AccessMethod,
        useAuth: boolean = false,
        requestData: any = {},
    ) {
        const callAPI = new CallAPI()
        callAPI.axiosURL = `${BaseURL}/${endPoint}`
        callAPI.requestData = requestData
        callAPI.useAuth = useAuth

        switch (method) {
            case "get":
                await callAPI.get()
                break;
            case "post":
                await callAPI.post()
                break
            default:
                break
        }

        return {
            success: callAPI.success,
            responseData: callAPI.responseData
        }
    }

    public convertGetRequest() {
        const requestData = this.requestData
        let requestParams = ""
        for (const dataKey in requestData) {
            console.log("?" + dataKey + "=" + requestData[dataKey])
            requestParams += `?${dataKey}=${requestData[dataKey]}`
        }

        this.axiosURL = this.axiosURL + requestParams

    }

    private async get() {
        console.log("G")
        if (!!this.requestData) {
            // GETのリクエストに送信するデータがある場合はobject型のリクエストデータをStringに変換しURLに繋げる。
            this.convertGetRequest()
        }
        if (this.useAuth) {
            const user = getAuth().currentUser
            if (!user) {
                return
            }
            const authToken = await user.getIdToken()
            const axiosConfig = {
                headers: {
                    authorization: `Barber ${authToken}`
                }
            }
            console.log(this.axiosURL)
            const axiosResult: any = await axios.get(this.axiosURL, axiosConfig)
            console.log("---------")
            console.log(axiosResult)
            console.log("---------")
            this.responseData = axiosResult.data
            return
        }
        // 認証なし版
        const axiosResult = await axios.get(this.axiosURL)
        this.responseData = axiosResult.data
        return
    }

    private async post(): Promise<void> {
        // TODO: 認証ありとなしで２回axiosへのアクセス処理書いてるのいつか直す
        if (this.useAuth) {
            const user = auth.currentUser
            if (!user) {
                this.success = false
                return
            }
            try {
                const authToken = await user.getIdToken()
                const axiosConfig = {
                    headers: {
                        authorization: `Barber ${authToken}`
                    }
                }
                const axiosResult: any = axios.post(this.axiosURL, this.requestData, axiosConfig)
                this.responseData = axiosResult.data
                this.success = true
                return
            } catch (error) {
                console.log(error)
                this.success = false
                return
            }
        }
        try {
            const axiosResult: any = axios.post(this.axiosURL, this.requestData)
            this.responseData = axiosResult.data
            this.success = true
            return
        } catch (error) {
            console.log(error)
            this.success = false
            return
        }
    }
}


