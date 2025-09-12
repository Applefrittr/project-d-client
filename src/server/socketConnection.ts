import { io } from "socket.io-client";

const url = "http://localhost:6969";

const socket = io(url, {
  autoConnect: false,
  reconnectionAttempts: 2,
});

export default socket;
