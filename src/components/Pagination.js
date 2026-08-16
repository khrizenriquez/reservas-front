"use client";

import { useMemo, useState } from "react";

export function usePagination(items, initialPageSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const activePage = Math.min(page, totalPages);

  return {
    page: activePage,
    pageSize,
    totalPages,
    setPage,
    setPageSize: (nextPageSize) => { setPageSize(nextPageSize); setPage(1); },
    pageItems: useMemo(() => items.slice((activePage - 1) * pageSize, activePage * pageSize), [activePage, items, pageSize])
  };
}

export function Pagination({ page, pageSize, totalItems, totalPages, setPage, setPageSize, labels }) {
  if (totalItems === 0) return null;
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, totalItems);
  return <nav className="pagination-controls" aria-label={labels.navigation}>
    <p className="pagination-summary">{labels.summary.replace("{first}", first).replace("{last}", last).replace("{total}", totalItems)}</p>
    <label className="pagination-size">{labels.perPage}<select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>{[10, 20, 50].map((size) => <option value={size} key={size}>{size}</option>)}</select></label>
    <div className="pagination-actions">
      <button type="button" className="button is-small" onClick={() => setPage(page - 1)} disabled={page === 1}>{labels.previous}</button>
      <span aria-live="polite">{labels.page.replace("{page}", page).replace("{total}", totalPages)}</span>
      <button type="button" className="button is-small" onClick={() => setPage(page + 1)} disabled={page === totalPages}>{labels.next}</button>
    </div>
  </nav>;
}
