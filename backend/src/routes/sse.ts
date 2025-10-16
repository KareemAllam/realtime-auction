import { Router, Request, Response } from "express";
import { Product } from "../models/Product";

const router: Router = Router();

const sseConnections = new Set<Response>();
let auctionProduct: Product | null = null;

const initializeAuction = () => {
  if (!auctionProduct) {
    auctionProduct = new Product(
      "1",
      "Vintage Watch",
      "Beautiful vintage watch from 1950s",
      100,
      "https://i.imgur.com/N3X9V4t.jpeg"
    );
  }
};

const broadcastToSSE = (event: string, data: any) => {
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseConnections.forEach((res) => {
    try {
      res.write(message);
    } catch (error) {
      console.error("Error writing to SSE connection:", error);
      sseConnections.delete(res);
    }
  });
};

router.get("/", (req: Request, res: Response) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Cache-Control",
  });

  sseConnections.add(res);

  initializeAuction();

  res.write(`data: SSE connection established\n\n`);

  if (auctionProduct) {
    res.write(`event: auction-state\n`);
    res.write(
      `data: ${JSON.stringify({
        product: auctionProduct,
        bids: auctionProduct.bids,
        currentPrice: auctionProduct.currentPrice,
      })}\n\n`
    );
  }

  const heartbeatInterval = setInterval(() => {
    try {
      res.write(`event: heartbeat\n`);
      res.write(
        `data: ${JSON.stringify({ timestamp: new Date().toISOString() })}\n\n`
      );
    } catch (error) {
      clearInterval(heartbeatInterval);
      sseConnections.delete(res);
    }
  }, 30000);

  const cleanup = () => {
    sseConnections.delete(res);
    clearInterval(heartbeatInterval);
  };

  req.on("close", cleanup);
  req.on("end", cleanup);
  req.on("error", cleanup);
});

router.get("/auction", (req: Request, res: Response) => {
  initializeAuction();
  if (auctionProduct) {
    res.json({
      product: auctionProduct,
      bids: auctionProduct.bids,
      currentPrice: auctionProduct.currentPrice,
    });
  } else {
    res.status(404).json({ message: "Auction not found" });
  }
});

router.post("/auction/bid", (req: Request, res: Response) => {
  const { bidderId, bidderName, amount } = req.body;
  if (!auctionProduct) {
    initializeAuction();
  }

  if (!bidderId || !bidderName || !amount) {
    res.status(400).json({
      message: "Missing required fields: bidderId, bidderName, amount",
    });
    return;
  }

  if (amount <= auctionProduct!.currentPrice) {
    res.status(400).json({
      message: "Bid must be higher than current price",
    });
    return;
  }

  const success = auctionProduct!.addBid(bidderId, bidderName, amount);

  if (success) {
    const newBid = auctionProduct!.bids[auctionProduct!.bids.length - 1];

    if (newBid) {
      broadcastToSSE("bid-update", {
        productId: auctionProduct!.id,
        newPrice: amount,
        bidder: bidderName,
        bidderId: bidderId,
        timestamp: new Date(),
        bidId: newBid.id,
      });

      res.json({
        success: true,
        message: "Bid placed successfully",
        bid: newBid,
        currentPrice: auctionProduct!.currentPrice,
      });
    } else {
      res.status(500).json({
        message: "Bid was added but could not be retrieved",
      });
    }
  } else {
    res.status(400).json({
      message: "Failed to place bid",
    });
  }
});

router.get("/auction/history", (req: Request, res: Response) => {
  initializeAuction();
  if (auctionProduct) {
    const highestBid =
      auctionProduct.bids.length > 0
        ? auctionProduct.bids[auctionProduct.bids.length - 1]
        : null;

    res.json({
      bids: auctionProduct.bids,
      totalBids: auctionProduct.bids.length,
      highestBid: highestBid,
    });
  } else {
    res.status(404).json({ message: "Auction not found" });
  }
});

router.post("/auction/reset", (req: Request, res: Response) => {
  auctionProduct = new Product(
    "1",
    "Vintage Watch",
    "Beautiful vintage watch from 1950s",
    100,
    "https://via.placeholder.com/300x200"
  );

  broadcastToSSE("auction-reset", {
    product: auctionProduct,
    message: "Auction has been reset",
  });

  res.json({
    success: true,
    message: "Auction reset successfully",
    product: auctionProduct,
  });
});

export { router as sseRouter };
