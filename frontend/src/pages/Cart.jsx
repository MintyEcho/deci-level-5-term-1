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

  if (isLoading) return <Loading />;
  if (isError) return <ErrorMessage error={error} />;

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cart.items.length === 0 && <p>Your cart is empty.</p>}
      <ul>
        {cart.items.map((item) => (
          <li key={item.id}>
            {item.product.name} — ${item.product.price} x
            <input
              type="number"
              min="0"
              value={item.quantity}
              onChange={(e) =>
                updateQty.mutate({ productId: item.productId, quantity: Number(e.target.value) })
              }
            />
            <button onClick={() => removeItem.mutate(item.productId)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: ${cart.total?.toFixed?.(2) ?? 0}</p>
      {(updateQty.isError || removeItem.isError) && (
        <ErrorMessage error={updateQty.error || removeItem.error} />
      )}
    </div>
  );
}
