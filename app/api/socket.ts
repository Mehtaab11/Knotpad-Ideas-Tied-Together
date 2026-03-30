import { Server } from "socket.io";

export default function handler(req: any, res: any) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.io");

    const io = new Server(res.socket.server);

    res.socket.server.io = io;
    
    io.on("connection", (socket) => {
      socket.on("join-room", (roomId) => {
        socket.join(roomId);
      });

      socket.on("send-changes", ({ roomId, content }) => {
        socket.to(roomId).emit("receive-changes", content);
      });
    });
  }

  res.end();
}