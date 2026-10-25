import ProductCard from "./ProductCard";

export default function ProductGrid({ products, loading, skeletons = 8 }) {
  if (loading) {
    return (
      <div className="pgrid" aria-busy="true" aria-label="Loading products">
        {Array.from({ length: skeletons }, (_, i) => (
          <div className="pcard skeleton" key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="pgrid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
