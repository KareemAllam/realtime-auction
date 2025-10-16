import React, { useState, useEffect } from 'react';
import useAuction from '../context/useAuction';

interface BidFormProps {
  onBid: (amount: number) => void;
}

const BidForm = ({ onBid }: BidFormProps) => {
  const { state } = useAuction();
  const [bidAmount, setBidAmount] = useState('');

  const currentProduct = state.product;
  const currentPrice = currentProduct?.currentPrice || 0;

  useEffect(() => {
    setBidAmount('');
  }, [currentPrice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(bidAmount);

    if (amount <= currentPrice) {
      alert(`Bid must be higher than $${currentPrice}`);
      return;
    }

    onBid(amount);
    setBidAmount('');
  };

  const quickBid = (increment: number) => {
    const newAmount = currentPrice + increment;
    setBidAmount(newAmount.toString());
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">Place a Bid</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bidAmount" className="block text-sm font-semibold text-gray-700 mb-2">
            Bid Amount:
          </label>
          <input
            type="number"
            id="bidAmount"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder={`Minimum: $${currentPrice + 1}`}
            min={currentPrice + 1}
            step="0.01"
            required
            className="w-full p-3 border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => quickBid(5)}
            className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
          >
            +$5
          </button>
          <button
            type="button"
            onClick={() => quickBid(10)}
            className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
          >
            +$10
          </button>
          <button
            type="button"
            onClick={() => quickBid(25)}
            className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
          >
            +$25
          </button>
          <button
            type="button"
            onClick={() => quickBid(50)}
            className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
          >
            +$50
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors font-semibold text-lg"
        >
          Place Bid
        </button>
      </form>
    </div>
  );
};

export default BidForm;
