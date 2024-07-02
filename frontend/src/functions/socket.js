// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5001", {
  transports: ["websocket"], // Force WebSocket
  reconnectionAttempts: 5, // Retry up to 5 times
  reconnectionDelay: 2000, // Wait for 2 seconds before attempting reconnection
});

export default socket;
