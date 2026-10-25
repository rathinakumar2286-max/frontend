import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as productService from "../services/product.service";
import useCategories from "../hooks/useCategories";
import ProductGrid from "../components/ProductGrid";
import { emojiFor, formatPrice } from "../utils/format";
import { useCart } from "../context/CartContext";

export default function Home() {
  const navigate = useNavigate();
  const categories = useCategories();
  const { summary } = useCart();
  const [term, setTerm] = useState("");
  const [deals, setDeals] = useState(null);
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    productService
      .list({ sort: "discount", inStock: true, limit: 8 })
      .then((r) => setDeals(r.data.filter((p) => p.discountPercent > 0)))
      .catch(() => setDeals([]));
    productService
      .list({ featured: true, inStock: true, limit: 8 })
      .then((r) => setFeatured(r.data))
      .catch(() => setFeatured([]));
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    const q = term.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
  };

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <h1>What’s on your list today?</h1>
          <form className="hero-search" role="search" onSubmit={onSearch}>
            <input
              type="search"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Type an item, like atta, eggs or bananas"
              aria-label="Search products"
            />
            <button type="submit">Find it</button>
          </form>
          <p className="hero-note">
            Delivery is free on orders above {formatPrice(summary.freeDeliveryAbove || 500)}. You pick a delivery slot at checkout.
          </p>
          {categories.length > 0 && (
            <ul className="hero-chips">
              {categories.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <Link to={`/products?categoryId=${c.id}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <div className="container">
        {categories.length > 0 && (
          <section className="block" aria-labelledby="shop-cats">
            <h2 id="shop-cats">Shop by category</h2>
            <ul className="cat-grid">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link to={`/products?categoryId=${c.id}`} className="cat-tile">
                    <span className="cat-emoji" aria-hidden="true">{emojiFor(c.name)}</span>
                    <span className="cat-name">{c.name}</span>
                    <span className="cat-sub">
                      {c.subCategories.length > 0 ? `${c.subCategories.length} sections` : "Browse all"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {(deals === null || deals.length > 0) && (
          <section className="block" aria-labelledby="deals">
            <div className="block-head">
              <h2 id="deals">Today’s deals</h2>
              <Link to="/products?sort=discount">See all deals</Link>
            </div>
            <ProductGrid products={deals || []} loading={deals === null} />
          </section>
        )}

        {(featured === null || featured.length > 0) && (
          <section className="block" aria-labelledby="featured">
            <div className="block-head">
              <h2 id="featured">Picked for you</h2>
              <Link to="/products">Browse everything</Link>
            </div>
            <ProductGrid products={featured || []} loading={featured === null} />
          </section>
        )}

        {deals?.length === 0 && featured?.length === 0 && (
          <p className="page-note">Products will show up here once they’re added to the store.</p>
        )}
      </div>
    </>
  );
}
