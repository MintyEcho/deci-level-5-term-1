import { http, HttpResponse } from "msw";

const API_URL = "http://localhost:5000/api";

export const handlers = [
  http.get(`${API_URL}/products`, () => {
    return HttpResponse.json({
      data: [
        { id: 1, name: "Phone X", price: 699, category: { name: "Phones" } },
        { id: 2, name: "Laptop Pro", price: 1299, category: { name: "Laptops" } },
      ],
      pagination: { page: 1, limit: 12, total: 2, pages: 1 },
    });
  }),

  http.get(`${API_URL}/products/:id`, ({ params }) => {
    return HttpResponse.json({
      id: Number(params.id),
      name: "Phone X",
      description: "A great phone",
      price: 699,
      category: { name: "Phones" },
      images: [],
    });
  }),

  http.get(`${API_URL}/categories`, () => {
    return HttpResponse.json([
      { id: 1, name: "Phones" },
      { id: 2, name: "Laptops" },
    ]);
  }),

  http.get(`${API_URL}/cart`, () => {
    return HttpResponse.json({ items: [], total: 0 });
  }),
];
