import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const rooms: Record<string, string[]> = {};
// Functions here are written with the Client Perspectives in mind, so the client is sending the data to the server and the server is broadcasting it to other clients in the same room.

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId: string) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    rooms[roomId].push(socket.id);

    // Notify other users in the room about the new user
    io.to(roomId).emit("users", rooms[roomId]);
  });

  socket.on("typing", (roomId: string) => {
    socket.to(roomId).emit("user-typing");
  });

  socket.on(
    "send-changes-content",
    ({ roomId, content }: { roomId: string; content: string }) => {
      socket.to(roomId).emit("receive-changes-content", content);
    },
  );
  socket.on(
    "send-changes-title",
    ({ roomId, title }: { roomId: string; title: string }) => {
      socket.to(roomId).emit("receive-changes-title", title);
    },
  );

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);

      io.to(roomId).emit("users", rooms[roomId]);
    }
  });
});

httpServer.listen(4000, () => {
  console.log("Socket server running on port 4000");
});
