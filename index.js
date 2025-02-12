import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import blogRoute from "./routes/blogRoute.js";
import messageRoute from "./routes/messageRoute.js";
import MessageModel from "./models/message.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = createServer(app); // Create an HTTP server

// Middleware
app.use(morgan("dev"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({ origin: "*", methods: ["GET", "POST"] })); // Set correct CORS

// Initialize Socket.IO
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Socket.IO Setup
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("sendMessage", async ({ senderId, receiverId, content }) => {
    const message = { senderId, receiverId, content, timestamp: new Date() };

    try {
      const newMessage = new MessageModel(message);
      // await newMessage.save();
      io.emit("receiveMessage", message);
    } catch (error) {
      console.error("❌ Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/profilephotos",
  express.static(path.join(__dirname, "profilephotos"))
);
app.use("/blogs", express.static(path.join(__dirname, "blogs")));

// Routes
app.use("/", userRoute);
app.use("/", postRoute);
app.use("/", blogRoute);
app.use("/", messageRoute);

// MongoDB Connection & Server Start
const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL;

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URL);
    server.listen(PORT, () => {
      console.log(`✅ Server is running on ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
  }
}

startServer();
