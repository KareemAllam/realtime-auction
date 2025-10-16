import useAuction from '../context/useAuction';
import type { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductListProps {
  onProductSelect: (product: Product) => void;
}

const ProductList = ({ onProductSelect }: ProductListProps) => {
  const { state } = useAuction();

  if (state.loading) {
    return (
      <div className="text-center py-8">
        <div className="text-xl text-gray-600">Loading products...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Available Auctions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {
          state.product && (
            <ProductCard key={state.product.id} product={state.product} onProductSelect={onProductSelect} />
          )
        }
      </div>
    </div>
  );
};

export default ProductList;
