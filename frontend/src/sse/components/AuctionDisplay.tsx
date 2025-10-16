import type { AuctionState } from "../controllers/auctionController";

interface AuctionDisplayProps {
  auctionState: AuctionState | null;
}

const AuctionDisplay = ({ auctionState }: AuctionDisplayProps) => {
  if (!auctionState) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="text-center py-8">
          <div className="text-xl text-gray-600">Loading auction...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Current Auction</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <img
            src={auctionState.product?.imageUrl}
            alt={auctionState.product?.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h4 className="text-lg font-semibold text-gray-800">{auctionState.product?.name}</h4>
          <p className="text-gray-600 mb-2">{auctionState.product?.description}</p>
          <div className="text-2xl font-bold text-green-600">
            Current Price: ${auctionState.currentPrice}
          </div>
          <div className="text-gray-500">
            Total Bids: {auctionState.bids.length}
          </div>
        </div>
        <div>
          <h5 className="text-lg font-semibold text-gray-800 mb-3">Recent Bids</h5>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {auctionState.bids.slice(-5).reverse().map((bid, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="font-semibold text-gray-800">{bid.bidderName}</span>
                <span className="font-bold text-green-600">${bid.amount}</span>
                <span className="text-sm text-gray-500">
                  {new Date(bid.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
            {auctionState.bids.length === 0 && (
              <p className="text-gray-500 text-center py-4">No bids yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDisplay;
