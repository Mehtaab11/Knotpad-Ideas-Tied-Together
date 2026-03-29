import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: any) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("join-room", (roomId) => {
        socket.join(roomId);
      });

      socket.on("send-changes", ({ roomId, content }) => {
        socket.to(roomId).emit("receive-changes", content);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }

  return io;
};