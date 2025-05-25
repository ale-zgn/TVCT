import { useState, useEffect } from "react"
import { getSocket, socketAuth } from "../Socket"
import { Socket } from "socket.io-client"

type OnReactiveType = {
    data: any
    action: "create" | "update" | "delete"
    model: string
}

const useSocket = ({ onReactive }: { onReactive: (data: any) => void }) => {
    const [socketInstance, setSocketInstance] = useState<Socket>(getSocket())

    useEffect(() => {

        if (onReactive) {
            socketInstance?.on("reactive", onReactive)
            // try {
            //     socketInstance?.on("reactive", (data) => {
            //         try {
            //             onReactive(data)
            //         } catch (err) {
            //             console.log("error1", err)
            //         }
            //     })
            // } catch (err) {
            //     console.log("error", err)
            // }
        }

        return () => {
            if (onReactive) {
                // socketInstance?.off("reactive", (data) => {
                // 	console.log("off:",data)
                // })
                socketInstance?.off("reactive", onReactive)
            }
        }
    }, [])

    return { socketInstance, socketAuth }
}

export default useSocket
