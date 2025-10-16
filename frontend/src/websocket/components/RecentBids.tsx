import useAuction from "../context/useAuction";

export default function RecentBids() {
  const { state } = useAuction();
  const bids = state.bids;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Bids</h3>
      <div className="space-y-3">
        {bids.slice(-5).reverse().map((bid) => (
          <div key={bid.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-md border border-gray-200">
            <span className="font-semibold text-gray-800">{bid.bidderName}</span>
            <span className="font-bold text-green-600">${bid.amount}</span>
            <span className="text-sm text-gray-500">
              {new Date(bid.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}