import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = (onMessage) => {
    const socket = new SockJS("http://localhost:8080/ws");

    stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,

        onConnect: () => {
            console.log("WebSocket Connected");

            stompClient.subscribe("/topic/admin", (message) => {
                const body = JSON.parse(message.body);
                onMessage(body);
            });
        },

        onStompError: (frame) => {
            console.log("STOMP error:", frame);
        }
    });

    stompClient.activate();
};

export const disconnectWebSocket = () => {
    if (stompClient) {
        stompClient.deactivate();
        stompClient = null;
    }
};