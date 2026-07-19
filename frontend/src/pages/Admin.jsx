import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

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
    <div>
      <h2>Admin Dashboard</h2>

      {stats && (
        <section>
          <h3>Store Stats</h3>
          <ul>
            <li>Users: {stats.users}</li>
            <li>Products: {stats.products}</li>
            <li>Orders: {stats.orders}</li>
            <li>Categories: {stats.categories}</li>
            <li>Reviews: {stats.reviews}</li>
          </ul>
        </section>
      )}

      <section>
        <h3>Add Product</h3>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <select
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
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button type="submit" disabled={createProduct.isPending}>
            {createProduct.isPending ? "Adding..." : "Add Product"}
          </button>
        </form>
        {createProduct.isError && <ErrorMessage error={createProduct.error} />}
      </section>

      <section>
        <h3>Products</h3>
        {isLoading && <Loading />}
        {isError && <ErrorMessage error={error} />}
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>${p.price}</td>
                <td>{p.category?.name}</td>
                <td>{p.stock}</td>
                <td>
                  <button onClick={() => deleteProduct.mutate(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
