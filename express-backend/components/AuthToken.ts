import {DecodedIdToken, getAuth} from "firebase-admin/auth";

import {AuthTokenResult} from "../Types";

export const AuthToken = async (token: string): Promise<AuthTokenResult> => {
    console.log(token)
    try {
        const authResult:DecodedIdToken = await getAuth().verifyIdToken(token)
        return {
            success: true,
            userId: authResult.uid
        }
    } catch (e) {
        console.log(e)
        return {
            success: false
        }
    }

}
