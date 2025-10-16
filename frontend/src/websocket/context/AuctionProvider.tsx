import { useReducer, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import socketService from '../services/socketService';
import type { Product, BidUpdate } from '../../types';
import { auctionReducer } from '../reducers/auctionReducer';
import type { AuctionState } from '../reducers/auctionReducer';
import { AuctionContext } from './useAuction';

const initialState: AuctionState = {
  product: null,
  loading: true,
  connected: false,
  currentUserId: '',
  bids: [],
};

// Context interface
export interface AuctionContextType {
  state: AuctionState;
  placeBid: (productId: string, amount: number) => void;
  getProductDetails: () => void;
}

const AuctionProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = useReducer(auctionReducer, initialState);
  const currentUserIdRef = useRef(state.currentUserId);

  useEffect(() => {
    currentUserIdRef.current = state.currentUserId;
  }, [state.currentUserId]);

  useEffect(() => {
    const socket = socketService.connect();

    socket.on('connect', () => {
      dispatch({
        type: 'UPDATE_CONNECTION_STATUS',
        payload: { connected: true, currentUserId: socket.id ?? "Anonymous" }
      });
      toast.success('Connected to auction server', {
        position: "top-right",
        autoClose: 2000,
      });

      socket.emit('join-auction');
      socket.emit('get-product-details');
    });

    socket.on('disconnect', () => {
      dispatch({
        type: 'UPDATE_CONNECTION_STATUS',
        payload: { connected: false, currentUserId: null }
      });
      toast.warning('Disconnected from auction server', {
        position: "top-right",
        autoClose: 3000,
      });
    });

    socket.on('product-details', (product: Product) => {
      dispatch({ type: 'UPDATE_PRODUCT', payload: { product, bids: [] } });
    });

    socket.on('bid-update', (update: BidUpdate) => {
      const isMyBid = update.bidderSocketId === socket.id;

      dispatch({
        type: 'UPDATE_PRODUCT', payload: {
          bids: [...state.bids, {
            id: update.bidId,
            bidderId: update.bidderId,
            bidderName: update.bidder,
            amount: update.newPrice,
            timestamp: update.timestamp
          }],
          product: { ...state.product, currentPrice: update.newPrice } as Product,
        }
      });

      if (isMyBid) {
        toast.success(`Your bid of $${update.newPrice} was placed successfully!`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.info(`New bid: $${update.newPrice} by ${update.bidder}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    });

    socket.on('bid-error', (error: { message: string }) => {
      toast.error(`Bid Error: ${error.message}`, {
        position: "top-right",
        autoClose: 4000,
      });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('product-details');
      socket.off('bid-update');
      socket.off('bid-error');
    };
  }, []);

  const placeBid = useCallback((_productId: string, amount: number) => {
    const socket = socketService.getSocket();
    if (socket) {
      socket.emit('place-bid', {
        bidderId: socket.id,
        bidderName: socket.id,
        amount: parseFloat(amount.toString())
      });
      toast.info(`Placing bid of $${amount}...`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  }, []);

  const getProductDetails = useCallback(() => {
    const socket = socketService.getSocket();
    if (socket) {
      socket.emit('get-product-details');
    }
  }, []);

  const value: AuctionContextType = {
    state,
    placeBid,
    getProductDetails,
  };

  return (
    <AuctionContext.Provider value={value}>
      {children}
    </AuctionContext.Provider>
  );
}

export default AuctionProvider;