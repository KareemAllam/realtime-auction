import { server } from "./app";

const PORT: number = parseInt(process.env.PORT || "5000", 10);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready for connections`);
});
