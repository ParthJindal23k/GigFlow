require("dotenv").config()

const http = require("http")
const {Server} = require("socket.io")
const app = require("./app")
const connectDatabase = require("./config/db")
const onlineUser= require("./utils/onlineUser")
const cors= require("cors")

const server = http.createServer(app)

app.use(cors({
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true
}));
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://gig-flow-dun.vercel.app",
  "http://localhost:5173"
].filter(Boolean); // removes undefined

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});


console.log("Allowed Origins:", allowedOrigins);
global.io = io


io.on("connection",(socket)=>{
    console.log("User connnected" , socket.id)
    socket.on("register",(userId)=>{
        onlineUser.set(userId,socket.id)
    })

    socket.on("disconnect",()=>{
        for(let [key,value] of onlineUser){
            if(value === socket.id){
                onlineUser.delete(key)
            }
        }
    })
})

const PORT = process.env.PORT

connectDatabase()

server.listen(PORT,()=>{
    console.log(`Server is Running on ${PORT}`)
})

