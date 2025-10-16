import { toast } from "react-toastify";
import type { Bid, Product } from "../../types";

export interface BidRequest {
  bidderId: string;
  bidderName: string;
  amount: number;
}

export interface AuctionState {
  product: Product;
  bids: Bid[];
  currentPrice: number;
}

class AuctionController {
  private baseUrl = "http://localhost:5000/api/sse";

  async placeBid(bidRequest: BidRequest): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auction/bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bidRequest),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          `Your bid of $${bidRequest.amount} was placed successfully!`,
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        return true;
      } else {
        toast.error(data.message || "Failed to place bid", {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      toast.error("Failed to place bid", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }
  }

  async resetAuction(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auction/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Auction reset successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        return true;
      } else {
        toast.error(data.message || "Failed to reset auction", {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }
    } catch (error) {
      console.error("Error resetting auction:", error);
      toast.error("Failed to reset auction", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }
  }

  async getAuctionState(): Promise<AuctionState | null> {
    try {
      const response = await fetch(`${this.baseUrl}/auction`);
      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        console.error("Failed to get auction state:", data.message);
        return null;
      }
    } catch (error) {
      console.error("Error getting auction state:", error);
      return null;
    }
  }

  async getAuctionHistory(): Promise<Bid[]> {
    try {
      const response = await fetch(`${this.baseUrl}/auction/history`);
      const data = await response.json();

      if (response.ok) {
        return data.bids;
      } else {
        console.error("Failed to get auction history:", data.message);
        return [];
      }
    } catch (error) {
      console.error("Error getting auction history:", error);
      return [];
    }
  }
}

export default new AuctionController();
