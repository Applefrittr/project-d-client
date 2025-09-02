import { io } from "socket.io-client";

const url = "http://localhost:6969";

const socket = io(url, {
  autoConnect: false,
});

export default socket;
