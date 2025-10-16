export type Bid = {
  id: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: Date;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  currentPrice: number;
  bids: Bid[];
};

export type BidUpdate = {
  productId: string;
  newPrice: number;
  timestamp: Date;
  bidId: string;
  bidderId: string;
  bidder: string;
  bidderSocketId: string;
};
