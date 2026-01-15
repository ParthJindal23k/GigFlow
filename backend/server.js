require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = require("./app");
const connectDatabase = require("./config/db");
const onlineUser = require("./utils/onlineUser");

const FRONTEND_URL = process.env.FRONTEND_URL || "https://gig-flow-dun.vercel.app";

const server = http.createServer(app);

// More permissive Socket.IO CORS configuration
const io = new Server(server, {
  cors: {
    origin: [
      FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:3000",
      /^https:\/\/.*\.vercel\.app$/,
      /^https:\/\/.*\.ngrok-free\.app$/,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["*"],
  },
  transports: ['websocket', 'polling'], // Allow both transports
  allowEIO3: true, // Allow older clients
  pingTimeout: 60000,
  pingInterval: 25000,
});

global.io = io;

// Add error handling to Socket.IO
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("register", (userId) => {
    try {
      onlineUser.set(userId, socket.id);
      console.log(`User registered: ${userId} -> ${socket.id}`);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  });

  socket.on("disconnect", () => {
    try {
      console.log("❌ User disconnected:", socket.id);
      for (let [key, value] of onlineUser) {
        if (value === socket.id) {
          onlineUser.delete(key);
          console.log(`Removed user: ${key}`);
        }
      }
    } catch (error) {
      console.error("Error on disconnect:", error);
    }
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

io.engine.on("connection_error", (err) => {
  console.error("Connection error:", err.code, err.message, err.context);
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Connect to database first
connectDatabase().then(() => {
  server.listen(PORT, HOST, () => {
    console.log(`✅ Server running on ${HOST}:${PORT}`);
    console.log(`✅ Frontend URL: ${FRONTEND_URL}`);
    console.log(`✅ CORS enabled for Socket.IO`);
  });
}).catch((error) => {
  console.error("Failed to connect to database:", error);
  process.exit(1);
});

module.exports = { onlineUser };