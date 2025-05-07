import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    //     apiKey: "AIzaSyBVbiZ5PogM04hrpwaPKUlt1tz0dt_Xy30",
    //   authDomain: "chats-c3c50.firebaseapp.com",
    //   projectId: "chats-c3c50",
    //   storageBucket: "chats-c3c50.firebasestorage.app",
    //   messagingSenderId: "401727866528",
    //   appId: "1:401727866528:web:3f77ce9bc421ce7b12abc5",
    //   measurementId: "G-DLESP20H9M"

    apiKey: "AIzaSyDwWx3VMUkH8B5tIzwL-7-Qok-p0GGGZpQ",
    authDomain: "headstaart.firebaseapp.com",
    projectId: "headstaart",
    storageBucket: "headstaart.firebasestorage.app",
    messagingSenderId: "792517609416",
    appId: "1:792517609416:web:8acd2f6f1df5904ad0a2fd",
    measurementId: "G-FK0K4JC15L"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
