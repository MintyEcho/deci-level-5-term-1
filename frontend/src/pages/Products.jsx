import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api";
import ProductCard from "../components/ProductCard.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const inputClass =
  "rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

export default function Products() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", { search, sort, page }],
    queryFn: () =>
      api
        .get("/products", { params: { search, sort, page, limit: 12 } })
        .then((res) => res.data),
    keepPreviousData: true,
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Products</h2>

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          className={`${inputClass} flex-1 min-w-[200px]`}
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <select
          className={inputClass}
          value={sort}
          onChange={(e) => {
            setPage(1);
            setSort(e.target.value);
          }}
        >
          <option value="">Default</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A-Z</option>
          <option value="name_desc">Name: Z-A</option>
        </select>
      </div>

      {isLoading && <Loading />}
      {isError && <ErrorMessage error={error} />}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.data.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-40"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>
            <span className="text-sm text-gray-500">
              Page {data.pagination.page} of {data.pagination.pages || 1}
            </span>
            <button
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-40"
              disabled={page >= data.pagination.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
