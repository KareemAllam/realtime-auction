import { useSSEAuction } from './hooks/useSSEAuction';
import ConnectionStatus from './components/ConnectionStatus';
import AuctionDisplay from './components/AuctionDisplay';
import BidForm from './components/BidForm';

const SSEView = () => {
  const {
    isConnected,
    auctionState,
    bidAmount,
    setBidAmount,
    bidderName,
    setBidderName,
    handlePlaceBid,
    handleResetAuction,
    disconnect,
    reconnect
  } = useSSEAuction();

  return (
    <div className="max-w-6xl mx-auto">
      <ConnectionStatus
        isConnected={isConnected}
        onReconnect={reconnect}
        onDisconnect={disconnect}
        onResetAuction={handleResetAuction}
      />

      <AuctionDisplay auctionState={auctionState} />

      <BidForm
        bidAmount={bidAmount}
        setBidAmount={setBidAmount}
        bidderName={bidderName}
        setBidderName={setBidderName}
        onPlaceBid={handlePlaceBid}
        currentPrice={auctionState?.currentPrice}
      />
    </div>
  );
};

export default SSEView;
