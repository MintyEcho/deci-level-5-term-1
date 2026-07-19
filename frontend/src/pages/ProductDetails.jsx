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

  if (isLoading) return <Loading />;
  if (isError) return <ErrorMessage error={error} />;
  if (!product) return null;

  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <p>Category: {product.category?.name}</p>
      <div>
        {product.images?.map((img) => (
          <img key={img.id} src={img.url} alt={product.name} width={120} />
        ))}
      </div>
      {token ? (
        <button onClick={() => addToCart.mutate()} disabled={addToCart.isPending}>
          {addToCart.isPending ? "Adding..." : "Add to Cart"}
        </button>
      ) : (
        <p>Log in to add this to your cart.</p>
      )}
      {addToCart.isError && <ErrorMessage error={addToCart.error} />}
      {addToCart.isSuccess && <p>Added to cart.</p>}
    </div>
  );
}
