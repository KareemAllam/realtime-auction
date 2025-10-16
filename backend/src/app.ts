import express, { Application, Request, Response, NextFunction } from "express";
import { createServer, Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import { productsRouter, setProduct } from "./routes/products";
import { sseRouter } from "./routes/sse";
import { AuctionSocket } from "./socket/auctionSocket";

const app: Application = express();
const server: Server = createServer(app);
const io: SocketIOServer = new SocketIOServer(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Initialize auction socket handler
const auctionSocket = new AuctionSocket(io);

// Set product reference for routes
setProduct(auctionSocket.getProduct());

// Routes
// app.use("/api/products", productsRouter);
// app.use("/api/sse", sseRouter);

// Socket.io connection handling
io.on("connection", (socket) => {
  auctionSocket.handleConnection(socket);
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

export { app, server };
