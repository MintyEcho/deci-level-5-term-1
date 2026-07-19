export default function ErrorMessage({ error }) {
  const message = error?.response?.data?.error || error?.message || "Something went wrong";
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      Error: {message}
    </div>
  );
}
