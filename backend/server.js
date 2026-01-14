require("dotenv").config()

const http = require("http")
const {Server} = require("socket.io")
const app = require("./app")
const connectDatabase = require("./config/db")
const onlineUser= require("./utils/onlineUser")

const server = http.createServer(app)

app.use(cors({
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true
}));

const io = new Server(server,{
    cors:{
        origin:`${process.env.FRONTEND_URL}`,
        methods:["GET","POST"],
        credentials:true
    }
})

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

