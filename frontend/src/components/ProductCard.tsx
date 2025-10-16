import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onProductSelect: (product: Product) => void;
}

export default function ProductCard({ product, onProductSelect }: ProductCardProps) {
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      onClick={() => onProductSelect(product)}
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl font-bold text-green-600">${product.currentPrice}</span>
        <span className="text-gray-500">{product.bids.length} bids</span>
      </div>
      <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold">
        View Auction
      </button>
    </div>
  );
}