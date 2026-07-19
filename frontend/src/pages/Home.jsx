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
    <div className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 px-8 py-16 text-white">
        <h1 className="text-3xl font-bold sm:text-4xl">Welcome to the Store</h1>
        <p className="mt-2 max-w-xl text-brand-50">
          Everything you need, all in one place. Browse our catalog and find your next favorite thing.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
        >
          Shop now
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Categories</h2>
        {loadingCategories && <Loading />}
        {categoriesError && <p className="text-sm text-gray-500">Could not load categories.</p>}
        <div className="flex flex-wrap gap-2">
          {categories?.map((c) => (
            <span
              key={c.id}
              className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700"
            >
              {c.name}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            View all →
          </Link>
        </div>
        {loadingProducts && <Loading />}
        {productsError && <ErrorMessage error={productsErr} />}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured?.data.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
