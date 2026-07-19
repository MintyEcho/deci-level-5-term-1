import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

describe("Loading", () => {
  it("shows a loading message", () => {
    render(<Loading />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});

describe("ErrorMessage", () => {
  it("shows the backend error message when present", () => {
    const error = { response: { data: { error: "Invalid credentials" } } };
    render(<ErrorMessage error={error} />);
    expect(screen.getByText(/Invalid credentials/)).toBeInTheDocument();
  });

  it("falls back to a generic message when none is provided", () => {
    render(<ErrorMessage error={{}} />);
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
  });
});
