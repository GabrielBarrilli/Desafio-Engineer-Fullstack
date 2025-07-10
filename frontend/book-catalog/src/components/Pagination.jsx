export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-4">
      <button
        className="px-2 py-1 border rounded"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        ◀
      </button>

      {[...Array(totalPages).keys()].map((p) => (
        <button
          key={p}
          className={`px-3 py-1 border rounded ${
            p === page ? 'bg-blue-600 text-white' : ''
          }`}
          onClick={() => onPageChange(p)}
        >
          {p + 1}
        </button>
      ))}

      <button
        className="px-2 py-1 border rounded"
        disabled={page === totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        ▶
      </button>
    </div>
  );
}
