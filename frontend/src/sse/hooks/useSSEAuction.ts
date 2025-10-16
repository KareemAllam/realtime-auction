import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import sseService from "../services/sseService";
import auctionController from "../controllers/auctionController";
import type { AuctionState } from "../controllers/auctionController";

export interface BidUpdate {
  productId: string;
  newPrice: number;
  bidder: string;
  bidderId: string;
  timestamp: string;
  bidId: string;
}

export const useSSEAuction = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidderName, setBidderName] = useState("");

  useEffect(() => {
    const connectSSE = async () => {
      await sseService.connect("http://localhost:5000/api/sse", {
        onOpen: () => {
          setIsConnected(true);
        },
        onAuctionState: (data: AuctionState) => {
          setAuctionState(data);
        },
        onBidUpdate: (data: BidUpdate) => {
          // State is already updated by the service fetching from backend
          toast.info(`New bid: $${data.newPrice} by ${data.bidder}`, {
            position: "top-right",
            autoClose: 3000,
          });
        },
        onAuctionReset: () => {
          // State is already updated by the service fetching from backend
          toast.warning("Auction has been reset", {
            position: "top-right",
            autoClose: 3000,
          });
        },
      });
    };

    connectSSE();

    return () => {
      sseService.disconnect();
      setIsConnected(false);
    };
  }, []);

  const handlePlaceBid = async () => {
    if (!bidAmount || !bidderName) {
      toast.error("Please enter both bidder name and amount", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid bid amount", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const success = await auctionController.placeBid({
      bidderId: `user-${Date.now()}`,
      bidderName: bidderName,
      amount: amount,
    });

    if (success) {
      setBidAmount("");
      setBidderName("");
    }
  };

  const handleResetAuction = async () => {
    await auctionController.resetAuction();
  };

  const disconnect = () => {
    sseService.disconnect();
    setIsConnected(false);
  };

  const reconnect = async () => {
    await sseService.reconnect("http://localhost:5000/api/sse", {
      onOpen: () => {
        setIsConnected(true);
      },
      onAuctionState: (data: AuctionState) => {
        setAuctionState(data);
      },
      onBidUpdate: (data: BidUpdate) => {
        // State is already updated by the service fetching from backend
        toast.info(`New bid: $${data.newPrice} by ${data.bidder}`, {
          position: "top-right",
          autoClose: 3000,
        });
      },
      onAuctionReset: () => {
        // State is already updated by the service fetching from backend
        toast.warning("Auction has been reset", {
          position: "top-right",
          autoClose: 3000,
        });
      },
    });
  };

  return {
    isConnected,
    auctionState,
    bidAmount,
    setBidAmount,
    bidderName,
    setBidderName,
    handlePlaceBid,
    handleResetAuction,
    disconnect,
    reconnect,
  };
};
