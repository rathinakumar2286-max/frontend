import { useState } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { STORE_NAME } from "../config";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import useCategories from "../hooks/useCategories";

export default function Header() {
  const { user, logout } = useAuth();
  const { summary } = useCart();
  const categories = useCategories();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [term, setTerm] = useState(params.get("search") || "");

  const onSearch = (e) => {
    e.preventDefault();
    const q = term.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
  };

  return (
    <header className="site-header">
      <div className="container header-bar">
        <Link to="/" className="brand">
          {STORE_NAME}
        </Link>

        <form className="header-search" role="search" onSubmit={onSearch}>
          <input
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search for milk, rice, tomatoes…"
            aria-label="Search products"
          />
          <button type="submit">Search</button>
        </form>

        <nav className="header-actions" aria-label="Account and cart">
          {user ? (
            <>
              <span className="hello">Hi, {user.name.split(" ")[0]}</span>
              <button className="link-btn" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" className="link-btn">
              Log in
            </Link>
          )}
          <Link to="/cart" className="cart-link" aria-label={`Cart, ${summary.itemCount} items`}>
            <span aria-hidden="true">🛒</span>
            <span>Cart</span>
            {summary.itemCount > 0 && <b className="cart-count">{summary.itemCount}</b>}
          </Link>
        </nav>
      </div>

      {categories.length > 0 && (
        <nav className="cat-strip" aria-label="Shop by category">
          <div className="container cat-strip-inner">
            <NavLink to="/products" end className="cat-chip">
              All products
            </NavLink>
            {categories.map((c) => (
              <Link key={c.id} to={`/products?categoryId=${c.id}`} className="cat-chip">
                {c.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
