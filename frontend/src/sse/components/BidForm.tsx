interface BidFormProps {
  bidAmount: string;
  setBidAmount: (value: string) => void;
  bidderName: string;
  setBidderName: (value: string) => void;
  onPlaceBid: () => void;
  currentPrice?: number;
}

const BidForm = ({
  bidAmount,
  setBidAmount,
  bidderName,
  setBidderName,
  onPlaceBid,
  currentPrice = 0
}: BidFormProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Place a Bid</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
          <input
            type="text"
            value={bidderName}
            onChange={(e) => setBidderName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bid Amount</label>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder="Enter bid amount"
            min={currentPrice}
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={onPlaceBid}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Place Bid
          </button>
        </div>
      </div>
    </div>
  );
};

export default BidForm;
