import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      {product.images?.[0] && <img src={product.images[0].url} alt={product.name} width={120} />}
      <h3>
        <Link to={`/products/${product.id}`}>{product.name}</Link>
      </h3>
      <p>${product.price}</p>
      <p>{product.category?.name}</p>
    </div>
  );
}
