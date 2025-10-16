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
    this.product = new Product(
      "1",
      "Vintage Watch",
      "Beautiful vintage watch from 1950s",
      100,
      "https://i.imgur.com/N3X9V4t.jpeg"
    );
  }

  public handleConnection(socket: Socket): void {
    socket.on("join-auction", () => {
      socket.join("auction");
      socket.emit("product-details", this.product);
      socket.emit("current-price", {
        productId: this.product.id,
        currentPrice: this.product.currentPrice,
      });
    });

    socket.on("leave-auction", () => {
      socket.leave("auction");
    });

    socket.on("get-product-details", () => {
      socket.emit("product-details", this.product);
    });

    socket.on("place-bid", (data: BidData) => {
      const { bidderId, bidderName, amount } = data;

      if (amount <= this.product?.currentPrice) {
        socket.emit("bid-error", {
          message: "Bid must be higher than current price",
        });
        return;
      }
      const success = this.product.addBid(bidderId, bidderName, amount);

      if (success) {
        this.io.to("auction").emit("bid-update", {
          productId: this.product.id,
          newPrice: amount,
          bidder: bidderName,
          bidderId: bidderId,
          timestamp: new Date(),
          bidId: this.product.bids[this.product.bids.length - 1]?.id,
          bidderSocketId: socket.id,
        });

        socket.emit("bid-success", {
          productId: this.product.id,
          amount,
          message: "Bid placed successfully!",
        });
      } else {
        socket.emit("bid-error", { message: "Failed to place bid" });
      }
    });
  }

  public getProduct(): Product {
    return this.product;
  }
}
