export interface Product {
  id: string;
  name: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  imageUrl: string;
  bids: Bid[];
  endTime: Date;
}

export interface Bid {
  id: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: Date;
}

export interface BidData {
  productId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
}

export interface BidUpdate {
  productId: string;
  newPrice: number;
  bidder: string;
  bidderId: string;
  timestamp: Date;
  bidId: string;
}

export interface PriceData {
  productId: string;
  currentPrice: number;
}

export interface SocketEvents {
  // Client to Server
  "join-product": (productId: string) => void;
  "leave-product": (productId: string) => void;
  "place-bid": (data: BidData) => void;

  // Server to Client
  "products-list": (products: Product[]) => void;
  "product-details": (product: Product) => void;
  "current-price": (data: PriceData) => void;
  "bid-update": (update: BidUpdate) => void;
  "bid-success": (data: {
    productId: string;
    amount: number;
    message: string;
  }) => void;
  "bid-error": (error: { message: string }) => void;
}
