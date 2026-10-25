import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as productService from "../services/product.service";
import useCategories from "../hooks/useCategories";
import ProductGrid from "../components/ProductGrid";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 12;

export default function Products() {
  const [params, setParams] = useSearchParams();
  const categories = useCategories();
  const [brands, setBrands] = useState([]);
  const [result, setResult] = useState({ data: [], pagination: { total: 0, totalPages: 1, page: 1 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const key = params.toString();
  const categoryId = params.get("categoryId");
  const subCategoryId = params.get("subCategoryId");
  const search = params.get("search");
  const sort = params.get("sort") || "newest";
  const page = Number(params.get("page")) || 1;

  useEffect(() => {
    productService.brands().then(setBrands).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    productService
      .list({ ...Object.fromEntries(params), limit: PAGE_SIZE })
      .then(setResult)
      .catch(() => setError("We couldn’t load products. Please try again."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Changing any filter goes back to page 1.
  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v === undefined || v === "" || v === false ? next.delete(k) : next.set(k, v)));
    if (!("page" in patch)) next.delete("page");
    setParams(next);
  };

  const activeCategory = useMemo(() => categories.find((c) => String(c.id) === categoryId), [categories, categoryId]);
  const title = search ? `Results for “${search}”` : activeCategory ? activeCategory.name : "All products";

  const onPrice = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    update({ minPrice: f.get("min"), maxPrice: f.get("max") });
  };

  const hasFilters = ["categoryId", "subCategoryId", "brandId", "minPrice", "maxPrice", "inStock", "search"].some((k) => params.has(k));

  return (
    <div className="container listing">
      <aside className={`filters ${filtersOpen ? "is-open" : ""}`} aria-label="Filters">
        <div className="filter-group">
          <h2>Category</h2>
          <ul className="filter-list">
            <li>
              <button className={!categoryId ? "is-active" : ""} onClick={() => update({ categoryId: "", subCategoryId: "" })}>
                All categories
              </button>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <button className={String(c.id) === categoryId ? "is-active" : ""} onClick={() => update({ categoryId: c.id, subCategoryId: "" })}>
                  {c.name}
                </button>
                {String(c.id) === categoryId && c.subCategories.length > 0 && (
                  <ul className="filter-sub">
                    {c.subCategories.map((s) => (
                      <li key={s.id}>
                        <button className={String(s.id) === subCategoryId ? "is-active" : ""} onClick={() => update({ subCategoryId: String(s.id) === subCategoryId ? "" : s.id })}>
                          {s.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="filter-group">
          <h2>Price</h2>
          <form className="price-form" onSubmit={onPrice} key={`${params.get("minPrice")}-${params.get("maxPrice")}`}>
            <label>
              <span className="sr-only">Minimum price</span>
              <input name="min" type="number" min="0" inputMode="numeric" placeholder="Min ₹" defaultValue={params.get("minPrice") || ""} />
            </label>
            <label>
              <span className="sr-only">Maximum price</span>
              <input name="max" type="number" min="0" inputMode="numeric" placeholder="Max ₹" defaultValue={params.get("maxPrice") || ""} />
            </label>
            <button type="submit">Apply</button>
          </form>
        </div>

        {brands.length > 0 && (
          <div className="filter-group">
            <h2>Brand</h2>
            <select value={params.get("brandId") || ""} onChange={(e) => update({ brandId: e.target.value })} aria-label="Brand">
              <option value="">All brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="filter-group">
          <label className="check">
            <input type="checkbox" checked={params.get("inStock") === "true"} onChange={(e) => update({ inStock: e.target.checked ? "true" : "" })} />
            Show only items in stock
          </label>
        </div>

        {hasFilters && (
          <button className="link-btn" onClick={() => setParams(new URLSearchParams())}>
            Clear all filters
          </button>
        )}
      </aside>

      <section className="results" aria-live="polite">
        <div className="results-head">
          <div>
            <h1>{title}</h1>
            {!loading && !error && (
              <p className="muted">
                {result.pagination.total} {result.pagination.total === 1 ? "item" : "items"}
              </p>
            )}
          </div>
          <div className="results-tools">
            <button className="filters-toggle" onClick={() => setFiltersOpen((o) => !o)} aria-expanded={filtersOpen}>
              Filters
            </button>
            <label className="sort">
              <span>Sort by</span>
              <select value={sort} onChange={(e) => update({ sort: e.target.value === "newest" ? "" : e.target.value })}>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
                <option value="discount">Biggest discount</option>
                <option value="name">Name A to Z</option>
              </select>
            </label>
          </div>
        </div>

        {error ? (
          <div className="empty">
            <p>{error}</p>
          </div>
        ) : !loading && result.data.length === 0 ? (
          <div className="empty">
            <h2>No products match</h2>
            <p>Try a different spelling, or remove a filter.</p>
            {hasFilters && (
              <button className="btn" onClick={() => setParams(new URLSearchParams())}>
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <ProductGrid products={result.data} loading={loading} skeletons={PAGE_SIZE} />
        )}

        <Pagination page={page} totalPages={result.pagination.totalPages} onChange={(p) => { update({ page: p }); window.scrollTo({ top: 0 }); }} />
      </section>
    </div>
  );
}
