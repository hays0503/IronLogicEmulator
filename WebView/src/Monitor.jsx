import React, { useEffect,useState } from "react"
import { WebSocketConnectionCustom } from "./WebSocketConnectionCustom";


export const Monitor = () => {

    const [WSConCustom,setWSConCustom] = useState();
    const [message,newMessage] = useState("null");

    useEffect(()=>{
        setWSConCustom(WebSocketConnectionCustom("ws://127.0.0.1:3331"));
        setWSConCustom.onmessage = function (event) {
		// alert(`[message] Данные получены с сервера: ${event.data}`);
        newMessage(event.data);
	};  
    },[]);

    // useEffect(()=>{        


    // },[setWSConCustom.onmessage]);



    return <>
        Content {message}
    </>
}