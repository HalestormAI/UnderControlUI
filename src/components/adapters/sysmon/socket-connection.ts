import {io} from "socket.io-client";
import {Socket} from "socket.io-client/build/socket";

interface Message {
    data: string;
    count: number
}

export const connectSocket = (url: string, namespace: string, stats_callback: Function): Socket => {
    const socket = io(url + namespace, {'transports': ['websocket']});
    socket.on('connect', function () {
        console.debug(`Socket [${socket.id}] connected for url: ${url + namespace}`);
    });
    socket.on('disconnect', function () {
        console.debug("Disconnected");
    });
    socket.on('connection_response', function (msg: Message) {
        console.log("Connection handshake complete: ", msg.data, msg.count);
    });
    socket.on('stats_update', function (msg: string) {
        stats_callback(msg);
    });
    console.debug(`Connecting socket: ${socket}`);
    return socket;
}

export const disconnectSocket = (socket: Socket) => {
    console.debug(`Disconnecting socket: ${socket.id}`);
    socket.disconnect();
}