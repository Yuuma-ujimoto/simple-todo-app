import {initializeApp} from "firebase/app"
import {getAuth} from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyBLAOsXlhw5dIjuWF40NMD5NFaE_vm8Scs",
    authDomain: "simpletodoapp-723f6.firebaseapp.com",
    projectId: "simpletodoapp-723f6",
    storageBucket: "simpletodoapp-723f6.appspot.com",
    messagingSenderId: "408496145210",
    appId: "1:408496145210:web:0df0efb44ddbdce7500603"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
