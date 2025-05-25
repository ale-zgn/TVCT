import io, { Socket } from 'socket.io-client';

import { getItemAsync } from "expo-secure-store"; //Or ReactJs with localStorage

import Config from '../Config';

let socket: Socket;

export const getSocket = (): Socket => {
    

    if (!socket) {

        socket = io(Config.EXPO_PUBLIC_API_ROOT, {
            transports: ['websocket'],
            forceNew: true,
            upgrade: false,
        });

        socket.on("connect", () => {
            getItemAsync("token").then((token) => {
                if (token) {
                    socketAuth(token);
                }
            });
        })

        socket.on("reconnect", () => {
            getItemAsync("token").then((token) => {
                if (token) {
                    socketAuth(token);
                }
            })
        })

    }
 
    return socket;
};

export const socketAuth = (token: string) => {
    socket.emit("auth", token)
}