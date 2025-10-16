import { Product as ProductInterface, Bid } from "../types";

export class Product implements ProductInterface {
  public id: string;
  public name: string;
  public description: string;
  public startingPrice: number;
  public currentPrice: number;
  public imageUrl: string;
  public bids: Bid[];
  public endTime: Date;

  constructor(
    id: string,
    name: string,
    description: string,
    startingPrice: number,
    imageUrl: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.startingPrice = startingPrice;
    this.currentPrice = startingPrice;
    this.imageUrl = imageUrl;
    this.bids = [];
    this.endTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
  }

  public addBid(bidderId: string, bidderName: string, amount: number): boolean {
    if (amount > this.currentPrice) {
      this.currentPrice = amount;
      this.bids.push({
        id: Date.now().toString(),
        bidderId,
        bidderName,
        amount,
        timestamp: new Date(),
      });
      return true;
    }
    return false;
  }
}
