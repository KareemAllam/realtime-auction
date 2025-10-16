import { Router, Request, Response } from "express";

const router: Router = Router();

// SSE endpoint
router.get("/", (req: Request, res: Response) => {
  // Set SSE headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Cache-Control",
  });

  // Send initial connection message
  res.write(`data: SSE connection established\n\n`);

  // Send periodic updates
  const interval = setInterval(() => {
    const timestamp = new Date().toISOString();
    res.write(`data: Server time: ${timestamp}\n\n`);
  }, 30000); // Send update every 30 seconds

  // Send auction updates (simulated)
  const auctionInterval = setInterval(() => {
    const mockBid = {
      bidder: `Bidder-${Math.floor(Math.random() * 1000)}`,
      amount: Math.floor(Math.random() * 1000) + 100,
      timestamp: new Date().toISOString(),
    };

    res.write(`event: auction-update\n`);
    res.write(`data: ${JSON.stringify(mockBid)}\n\n`);
  }, 45000); // Send auction update every 45 seconds

  // Handle client disconnect
  req.on("close", () => {
    console.log("SSE client disconnected");
    clearInterval(interval);
    clearInterval(auctionInterval);
  });

  // Handle client disconnect (alternative)
  req.on("end", () => {
    console.log("SSE client ended connection");
    clearInterval(interval);
    clearInterval(auctionInterval);
  });
});

export { router as sseRouter };
