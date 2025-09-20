import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import http from "http"
import { Server } from "socket.io"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import itemRouter from "./routes/item.routes.js"
import orderRouter from "./routes/order.routes.js"
import shopRouter from "./routes/shop.routes.js"
import userRouter from "./routes/user.routes.js"
import socketHandler from "./socket.js"
dotenv.config()
const port = process.env.PORT || 8000
const app=express()
const server=http.createServer(app)
const io=new Server(server,{
    cors: {
    origin: "https://food-order-frontend-two.vercel.app",    
    // origin:  "https://food-order-frontend-two.vercel.app", // production में specific domain डालना
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}
})
app.set("io", io);
app.use(cookieParser())
app.use(cors({
    origin: "https://food-order-frontend-two.vercel.app",
    credentials:true
}))
app.use(express.json())
// app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/shop",shopRouter)
app.use("/api/item",itemRouter)
app.use("/api/order",orderRouter)

socketHandler(io)

server.listen(port,()=>{
    console.log(`server started at ${port}`)
    connectDb()
})


// ====== DB Connection ======
mongoose
  .connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err))

// ====== Start Server ======
const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
