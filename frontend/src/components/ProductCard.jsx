import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="flex h-40 items-center justify-center bg-gray-100">
        {product.images?.[0] ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm text-gray-400">No image</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-brand-600">
          {product.name}
        </h3>
        {product.category?.name && (
          <span className="text-xs uppercase tracking-wide text-gray-400">
            {product.category.name}
          </span>
        )}
        <span className="mt-auto pt-2 text-lg font-bold text-gray-900">${product.price}</span>
      </div>
    </Link>
  );
}
