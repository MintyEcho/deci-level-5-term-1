export default function ErrorMessage({ error }) {
  const message = error?.response?.data?.error || error?.message || "Something went wrong";
  return <div className="error">Error: {message}</div>;
}
