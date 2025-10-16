import type { Product, Bid } from "../../types";

export interface AuctionState {
  product: Product | null;
  loading: boolean;
  connected: boolean;
  currentUserId: string | null;
  bids: Bid[];
}


type AuctionAction =
  | {
    type: 'UPDATE_CONNECTION_STATUS'; payload: Pick<AuctionState, 'connected' | 'currentUserId'>
  }
  | { type: 'UPDATE_PRODUCT'; payload: Pick<AuctionState, 'product' | 'bids'> }



// Reducer function
export function auctionReducer(state: AuctionState, action: AuctionAction): AuctionState {
  switch (action.type) {
    case "UPDATE_CONNECTION_STATUS": {
      return {
        ...state,
        connected: action.payload.connected,
        loading: !action.payload.connected,
        currentUserId: action.payload.currentUserId,
      };
    }

    case "UPDATE_PRODUCT": {
      return {
        ...state,
        product: { ...state.product, ...action.payload.product } as Product,
        bids: [...state.bids, ...action.payload.bids],
      };
    }
    default: {
      return state;
    }
  }
}
