import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function Cart() {
  const queryClient = useQueryClient();

  const { data: cart, isLoading, isError, error } = useQuery({
    queryKey: ["cart"],
    queryFn: () => api.get("/cart").then((res) => res.data),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["cart"] });

  const updateQty = useMutation({
    mutationFn: ({ productId, quantity }) => api.put(`/cart/items/${productId}`, { quantity }),
    onSuccess: invalidate,
  });

  const removeItem = useMutation({
    mutationFn: (productId) => api.delete(`/cart/items/${productId}`),
    onSuccess: invalidate,
  });

  if (isLoading) return <div className="mx-auto max-w-3xl px-6 py-10"><Loading /></div>;
  if (isError) return <div className="mx-auto max-w-3xl px-6 py-10"><ErrorMessage error={error} /></div>;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Shopping Cart</h2>

      {cart.items.length === 0 && (
        <p className="rounded-lg border border-dashed border-gray-300 py-10 text-center text-sm text-gray-500">
          Your cart is empty.
        </p>
      )}

      <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
        {cart.items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="font-medium text-gray-900">{item.product.name}</p>
              <p className="text-sm text-gray-500">${item.product.price}</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                value={item.quantity}
                onChange={(e) =>
                  updateQty.mutate({ productId: item.productId, quantity: Number(e.target.value) })
                }
                className="w-16 rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-center"
              />
              <button
                onClick={() => removeItem.mutate(item.productId)}
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between rounded-xl bg-gray-100 px-5 py-4">
        <span className="font-medium text-gray-700">Total</span>
        <span className="text-xl font-bold text-gray-900">${cart.total?.toFixed?.(2) ?? 0}</span>
      </div>

      {(updateQty.isError || removeItem.isError) && (
        <div className="mt-4">
          <ErrorMessage error={updateQty.error || removeItem.error} />
        </div>
      )}
    </div>
  );
}
