# 🧵 KnotPad — Real-Time Collaborative Editor

KnotPad is a real-time collaborative text editor that allows multiple users to edit the same document simultaneously. It is designed to demonstrate how modern web applications handle **real-time synchronization**, **state consistency**, and **low-latency communication** using WebSockets.

---

## ✨ Features

* 🔄 **Real-time Collaboration**

  * Multiple users can edit the same document simultaneously
  * Changes are reflected instantly across all connected clients

* ⚡ **Low Latency Communication**

  * Powered by Socket.IO for real-time bidirectional communication

* 🧠 **State Synchronization**

  * Ensures all users see the same content at the same time

* 🎨 **Modern UI**

  * Built with Tailwind CSS for a clean and responsive design

* 🧩 **Scalable Architecture**

  * Uses Next.js for both frontend and backend integration

---

## 🛠️ Tech Stack

| Technology       | Role                                                 |
| ---------------- | ---------------------------------------------------- |
| **Next.js**      | Full-stack React framework (frontend + backend APIs) |
| **Socket.IO**    | Real-time WebSocket communication                    |
| **Tailwind CSS** | Styling and responsive UI                            |
| **Node.js**      | Backend runtime                                      |

---

## 🧠 How It Works (Core Concept)

### 🔌 Real-Time Communication

At the heart of KnotPad is **Socket.IO**, which enables:

* Client connects to server via WebSocket
* User makes a change (typing)
* Client emits an event → `socket.emit("edit", data)`
* Server receives and broadcasts → `socket.broadcast.emit("update", data)`
* All connected clients receive updates instantly

---

### 🔁 Data Flow

```text
User A types → emit event → server receives →
broadcast to others → User B & C see update
```

---

### 🧩 Example Code (Core Logic)

#### Backend (Socket Server)

```js
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("edit-document", (data) => {
    socket.broadcast.emit("receive-changes", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
```

#### Frontend (Client)

```js
socket.emit("edit-document", content);

socket.on("receive-changes", (data) => {
  setContent(data);
});
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/knotpad.git
cd knotpad
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run the Development Server

```bash
npm run dev
```

### 4️⃣ Start Socket Server (if separate)

```bash
tsc server.ts
```

---

## 📁 Project Structure

```
/knotpad
 ├── /app          # Next.js app directory
 ├── /components   # UI components
 ├── /server       # Socket.IO server logic
 ├── /styles       # Tailwind styles
 └── package.json
```

---

## 🧪 Future Improvements

* 📝 Rich text editing (bold, italics, etc.)
* 🔐 Authentication (JWT / OAuth)
* 📄 Multiple document support
* 💾 Persistent storage (PostgreSQL)
* 🧑‍🤝‍🧑 User presence indicators (who is online)

---

## 🎯 Learning Outcomes

This project demonstrates:

* Real-time systems using WebSockets
* Event-driven architecture
* State synchronization challenges
* Full-stack development with Next.js
* Scalable frontend-backend communication

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Inspiration

Inspired by tools like Google Docs, KnotPad is a simplified implementation to understand the underlying real-time collaboration mechanisms.

---

## 👨‍💻 Author

**Mehtaab Aalam**

* GitHub: https://github.com/Mehtaab11
* LinkedIn: https://www.linkedin.com/in/mehtaabaalam/

---
