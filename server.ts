import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId: string) => {
    socket.join(roomId);
  });

  socket.on(
    "send-changes",
    ({ roomId, content }: { roomId: string; content: string }) => {
      socket.to(roomId).emit("receive-changes", content);
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(4000, () => {
  console.log("Socket server running on port 4000");
});