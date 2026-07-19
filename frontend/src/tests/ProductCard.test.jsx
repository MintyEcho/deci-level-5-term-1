import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import ProductCard from "../components/ProductCard.jsx";

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("ProductCard", () => {
  const product = { id: 1, name: "Phone X", price: 699, category: { name: "Phones" } };

  it("renders the product name, price, and category", () => {
    renderWithRouter(<ProductCard product={product} />);

    expect(screen.getByText("Phone X")).toBeInTheDocument();
    expect(screen.getByText("$699")).toBeInTheDocument();
    expect(screen.getByText("Phones")).toBeInTheDocument();
  });

  it("links to the product's detail page", () => {
    renderWithRouter(<ProductCard product={product} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/products/1");
  });
});
