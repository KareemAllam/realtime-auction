import { toast } from "react-toastify";
import auctionController from "../controllers/auctionController";
import type { AuctionState } from "../controllers/auctionController";
import type { BidUpdate } from "../hooks/useSSEAuction";

export interface SSEEventHandlers {
  onAuctionState?: (data: AuctionState) => void;
  onBidUpdate?: (data: BidUpdate) => void;
  onAuctionReset?: () => void;
  onOpen?: () => void;
}

class SSEService {
  private eventSource: EventSource | null = null;
  private isConnected = false;

  async connect(url: string, handlers: SSEEventHandlers = {}) {
    try {
      // Fetch initial state from backend first
      const initialState = await auctionController.getAuctionState();
      if (initialState) {
        handlers.onAuctionState?.(initialState);
      }

      this.eventSource = new EventSource(url);

      this.eventSource.onopen = () => {
        this.isConnected = true;
        toast.success("Connected to SSE server", {
          position: "top-right",
          autoClose: 2000,
        });
        handlers.onOpen?.();
      };

      this.eventSource.onerror = (errorEvent: Event) => {
        console.error("SSE error:", errorEvent);
        this.isConnected = false;
        toast.error("SSE connection error", {
          position: "top-right",
          autoClose: 3000,
        });
      };

      // Listen for auction state updates
      this.eventSource.addEventListener("auction-state", (event) => {
        const data = JSON.parse(event.data);
        handlers.onAuctionState?.(data);
      });

      // Listen for bid updates
      this.eventSource.addEventListener("bid-update", async (event) => {
        const data = JSON.parse(event.data);
        // Fetch fresh state from backend after bid update
        const updatedState = await auctionController.getAuctionState();
        if (updatedState) {
          handlers.onAuctionState?.(updatedState);
        }
        handlers.onBidUpdate?.(data);
      });
    } catch (error) {
      console.error("Failed to connect to SSE server", error);
      toast.error("Failed to connect to SSE server", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.isConnected = false;
    }
  }

  async reconnect(url: string, handlers: SSEEventHandlers = {}) {
    this.disconnect();
    setTimeout(async () => {
      await this.connect(url, handlers);
    }, 1000);
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

export default new SSEService();
