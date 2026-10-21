import { io } from "socket.io-client";

const socket = io("https://farmconnect-backend-n6mx.onrender.com", {
  autoConnect: false,
});

export default socket;