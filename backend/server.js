require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDatabase = require("./config/db");
const onlineUser = require("./utils/onlineUser");
const cors = require("cors");

const FRONTEND_URL = process.env.FRONTEND_URL || "https://gig-flow-dun.vercel.app";

const server = http.createServer(app);

/* EXPRESS CORS */
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

/* SOCKET CORS */
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

global.io = io;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUser.set(userId, socket.id);
  });

  socket.on("disconnect", () => {
    for (let [key, value] of onlineUser) {
      if (value === socket.id) {
        onlineUser.delete(key);
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

connectDatabase();

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
