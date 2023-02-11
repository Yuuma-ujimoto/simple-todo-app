import React, {useEffect, useState} from 'react';
import { GoogleAuthProvider, signInWithPopup} from "firebase/auth"
import {auth} from "./firebase"

function App() {
    const [isLogin, setLogin] = useState<Boolean>(false)

    useEffect(() => {
        console.log("effect")
        auth.onAuthStateChanged(user=>{

        })


    }, [])
    return (
        <main className="flex h-24 justify-start">
            {
                isLogin ?
                    <Login/> : <NoLogin/>
            }
        </main>
    );
}

const Login = () => {
    return (
        <div>
            <p>ログインしています。</p>
        </div>
    )
}

const NoLogin = () => {
    const doLogin = async () => {
        const provider = new GoogleAuthProvider()
        try {

            const result = await signInWithPopup(auth, provider)
            console.log(result)

         }catch (e){
            console.log(e)
        }
    }

    return (
        <div>
            <p>ログインしていません。</p>
            <button onClick={() => {
                doLogin()
            }}>ここからログイン
            </button>
        </div>
    )
}
export default App;
