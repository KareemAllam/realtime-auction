import express, { Application, Request, Response } from "express";
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

const auctionSocket = new AuctionSocket(io);

setProduct(auctionSocket.getProduct());

app.use("/api/products", productsRouter);
app.use("/api/sse", sseRouter);

io.on("connection", (socket) => {
  auctionSocket.handleConnection(socket);
});

app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

export { app, server };
