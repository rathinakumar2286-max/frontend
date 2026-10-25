export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  // Show first, last, and two pages either side of the current one.
  const pages = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 2) pages.push(p);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }

  return (
    <nav className="pager" aria-label="Pages">
      <button onClick={() => onChange(page - 1)} disabled={page <= 1}>
        Previous
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="pager-gap">…</span>
        ) : (
          <button key={p} className={p === page ? "is-current" : ""} onClick={() => onChange(p)} aria-current={p === page ? "page" : undefined}>
            {p}
          </button>
        )
      )}
      <button onClick={() => onChange(page + 1)} disabled={page >= totalPages}>
        Next
      </button>
    </nav>
  );
}
