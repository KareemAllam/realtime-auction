import { Server, Socket } from "socket.io";
import { Product } from "../models/Product";
import { BidData } from "../types";

export class AuctionSocket {
  private io: Server;
  private product!: Product;

  constructor(io: Server) {
    this.io = io;
    this.initializeProduct();
  }

  private initializeProduct(): void {
    // Single product auction
    this.product = new Product(
      "1",
      "Vintage Watch",
      "Beautiful vintage watch from 1950s",
      100,
      "https://via.placeholder.com/300x200"
    );
  }

  public handleConnection(socket: Socket): void {
    console.log("User connected:", socket.id);

    // Handle joining the auction
    socket.on("join-auction", () => {
      socket.join("auction");
      socket.emit("product-details", this.product);
      socket.emit("current-price", {
        productId: this.product.id,
        currentPrice: this.product.currentPrice,
      });
    });

    // Handle leaving the auction
    socket.on("leave-auction", () => {
      socket.leave("auction");
    });

    // Handle getting product details
    socket.on("get-product-details", () => {
      console.log("Getting product details");
      socket.emit("product-details", this.product);
    });

    // Handle placing a bid
    socket.on("place-bid", (data: BidData) => {
      const { bidderId, bidderName, amount } = data;

      if (amount <= this.product?.currentPrice) {
        socket.emit("bid-error", {
          message: "Bid must be higher than current price",
        });
        return;
      }
      // Add bid to product
      const success = this.product.addBid(bidderId, bidderName, amount);

      if (success) {
        // Broadcast to all users in the auction room
        this.io.to("auction").emit("bid-update", {
          productId: this.product.id,
          newPrice: amount,
          bidder: bidderName,
          bidderId: bidderId,
          timestamp: new Date(),
          bidId: this.product.bids[this.product.bids.length - 1]?.id,
          bidderSocketId: socket.id,
        });

        // Send success confirmation to bidder
        socket.emit("bid-success", {
          productId: this.product.id,
          amount,
          message: "Bid placed successfully!",
        });
      } else {
        socket.emit("bid-error", { message: "Failed to place bid" });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  }

  public getProduct(): Product {
    return this.product;
  }
}
