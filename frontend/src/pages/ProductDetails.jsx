import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../api";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const { token } = useAuth();

  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.get(`/products/${id}`).then((res) => res.data),
  });

  const addToCart = useMutation({
    mutationFn: () => api.post("/cart/items", { productId: Number(id), quantity: 1 }),
  });

  if (isLoading) return <div className="mx-auto max-w-4xl px-6 py-10"><Loading /></div>;
  if (isError) return <div className="mx-auto max-w-4xl px-6 py-10"><ErrorMessage error={error} /></div>;
  if (!product) return null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-xl bg-gray-100">
          {product.images?.[0] ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="h-full w-full rounded-xl object-cover"
            />
          ) : (
            <span className="text-sm text-gray-400">No image</span>
          )}
        </div>
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
            {product.category?.name}
          </span>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">{product.name}</h2>
          <p className="mt-3 text-gray-600">{product.description}</p>
          <p className="mt-4 text-3xl font-bold text-gray-900">${product.price}</p>

          {token ? (
            <button
              onClick={() => addToCart.mutate()}
              disabled={addToCart.isPending}
              className="mt-6 w-full rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60 sm:w-auto"
            >
              {addToCart.isPending ? "Adding..." : "Add to Cart"}
            </button>
          ) : (
            <p className="mt-6 text-sm text-gray-500">Log in to add this to your cart.</p>
          )}
          {addToCart.isError && (
            <div className="mt-3">
              <ErrorMessage error={addToCart.error} />
            </div>
          )}
          {addToCart.isSuccess && <p className="mt-3 text-sm text-green-600">Added to cart.</p>}
        </div>
      </div>
    </div>
  );
}
