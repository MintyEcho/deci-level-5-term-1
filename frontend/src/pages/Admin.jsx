import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const inputClass =
  "rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

export default function Admin() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", price: "", categoryId: "", description: "" });

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: () => api.get("/stats/summary").then((res) => res.data),
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => api.get("/products", { params: { limit: 100 } }).then((res) => res.data),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((res) => res.data),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-products"] });

  const createProduct = useMutation({
    mutationFn: (payload) => api.post("/products", payload),
    onSuccess: () => {
      invalidate();
      setForm({ name: "", price: "", categoryId: "", description: "" });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`),
    onSuccess: invalidate,
  });

  function handleSubmit(e) {
    e.preventDefault();
    createProduct.mutate(form);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Admin Dashboard</h2>

      {stats && (
        <section className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-5">
          {[
            ["Users", stats.users],
            ["Products", stats.products],
            ["Orders", stats.orders],
            ["Categories", stats.categories],
            ["Reviews", stats.reviews],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-gray-200 bg-white p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
            </div>
          ))}
        </section>
      )}

      <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-gray-900">Add Product</h3>
        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
          <input
            className={inputClass}
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <select
            className={inputClass}
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">Select category</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            className={inputClass}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button
            type="submit"
            disabled={createProduct.isPending}
            className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60 sm:col-span-2"
          >
            {createProduct.isPending ? "Adding..." : "Add Product"}
          </button>
        </form>
        {createProduct.isError && (
          <div className="mt-4">
            <ErrorMessage error={createProduct.error} />
          </div>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-gray-900">Products</h3>
        {isLoading && <Loading />}
        {isError && <ErrorMessage error={error} />}
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="py-2">Name</th>
              <th className="py-2">Price</th>
              <th className="py-2">Category</th>
              <th className="py-2">Stock</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data?.data.map((p) => (
              <tr key={p.id}>
                <td className="py-2 font-medium text-gray-900">{p.name}</td>
                <td className="py-2">${p.price}</td>
                <td className="py-2">{p.category?.name}</td>
                <td className="py-2">{p.stock}</td>
                <td className="py-2">
                  <button
                    onClick={() => deleteProduct.mutate(p.id)}
                    className="font-medium text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
