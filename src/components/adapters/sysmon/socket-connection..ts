import {io} from "socket.io-client";

interface Message {
    data: string;
    count: number
}

const connectSocket = (url: string, namespace: string, stats_callback: Function) => {
    const socket = io(url + namespace, {'transports': ['websocket']});
    socket.on('connect', function () {
        console.log(`Socket connected for url: ${url + namespace}`);
    });
    socket.on('disconnect', function () {
        console.log("Disconnected");
    });
    socket.on('connection_response', function (msg: Message) {
        console.log("Connection handshake complete: ", msg.data, msg.count);
    });
    socket.on('stats_update', function (msg: string) {
        console.log("Connection handshake complete: ", msg);
        stats_callback(msg);
    });
}

export default connectSocket;