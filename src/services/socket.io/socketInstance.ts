import { io } from "socket.io-client";
import { serverBaseURL } from "../serverBaseURL";

const socket = io(serverBaseURL, {
  autoConnect: false,
  reconnectionAttempts: 2,
});

export default socket;
