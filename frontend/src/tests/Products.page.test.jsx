import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";
import Products from "../pages/Products.jsx";

function renderProducts() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Products page", () => {
  it("shows a loading state, then renders products from the mocked API", async () => {
    renderProducts();

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Phone X")).toBeInTheDocument();
    });

    expect(screen.getByText("Laptop Pro")).toBeInTheDocument();
  });
});
