import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api";
import ProductCard from "../components/ProductCard.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

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
    <div>
      <h2>Products</h2>
      <input
        placeholder="Search products..."
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
      />
      <select
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

      {isLoading && <Loading />}
      {isError && <ErrorMessage error={error} />}

      {data && (
        <>
          <div className="product-grid">
            {data.data.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div>
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Prev
            </button>
            <span>
              {" "}
              Page {data.pagination.page} of {data.pagination.pages || 1}{" "}
            </span>
            <button
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
