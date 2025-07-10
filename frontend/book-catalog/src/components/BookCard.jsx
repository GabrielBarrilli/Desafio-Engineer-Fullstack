export default function BookCard({ book }) {
  return (
    <div className="border rounded p-4 shadow hover:shadow-md transition">
      <h2 className="font-semibold text-lg">{book.title}</h2>
      <p className="text-sm text-gray-600">{book.author}</p>
    </div>
  );
}
