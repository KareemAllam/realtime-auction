import { useEffect } from 'react';
import BidForm from './BidForm';
import useAuction from '../context/useAuction';
import RecentBids from './RecentBids';

const ProductDetail = () => {
  const { state, placeBid, getProductDetails } = useAuction();

  const currentProduct = state.product;

  useEffect(() => {
    getProductDetails();

  }, [getProductDetails]);

  const handleBid = (amount: number) => {
    if (currentProduct) {
      placeBid(currentProduct.id, amount);
    }
  };

  if (!currentProduct) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-8">
          <div className="text-xl text-gray-600">Loading auction...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <img
            src={currentProduct.imageUrl}
            alt={currentProduct.name}
            className="w-full h-80 object-cover rounded-lg"
          />
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{currentProduct.name}</h2>
            <p className="text-gray-600 mb-6">{currentProduct.description}</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-gray-700">Current Price:</span>
                <span className="text-3xl font-bold text-green-600">${currentProduct.currentPrice}</span>
              </div>
              <div className="text-gray-500">
                {currentProduct?.bids?.length} bids placed
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <BidForm
          onBid={handleBid}
        />
      </div>

      <RecentBids />
    </div>
  );
};

export default ProductDetail;