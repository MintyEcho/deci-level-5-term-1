import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api";
import ProductCard from "../components/ProductCard.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function Home() {
  const {
    data: featured,
    isLoading: loadingProducts,
    isError: productsError,
    error: productsErr,
  } = useQuery({
    queryKey: ["products", { page: 1, limit: 4 }],
    queryFn: () => api.get("/products", { params: { page: 1, limit: 4 } }).then((res) => res.data),
  });

  const {
    data: categories,
    isLoading: loadingCategories,
    isError: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((res) => res.data),
  });

  return (
    <div>
      <h1>Welcome to the Store</h1>

      <section>
        <h2>Categories</h2>
        {loadingCategories && <Loading />}
        {categoriesError && <p>Could not load categories.</p>}
        <ul>
          {categories?.map((c) => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Featured Products</h2>
        {loadingProducts && <Loading />}
        {productsError && <ErrorMessage error={productsErr} />}
        <div className="product-grid">
          {featured?.data.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <Link to="/products">View all products</Link>
      </section>
    </div>
  );
}
