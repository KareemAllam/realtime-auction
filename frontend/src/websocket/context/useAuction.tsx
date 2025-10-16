import { createContext, useContext } from "react";
import type { AuctionContextType } from "./AuctionProvider";


// Create context
export const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

// Custom hook to use the context 
function useAuction() {
  const context = useContext(AuctionContext);
  if (context === undefined) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
}

export default useAuction;