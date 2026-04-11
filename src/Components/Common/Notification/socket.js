import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "https://api.smarthajri.com"; // Replace with your actual server URL

function connectSocket(userId) {
  const socket = io(SOCKET_SERVER_URL, { query: { userId } });
  return socket;
}

export default connectSocket;
