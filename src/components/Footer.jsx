import { Link } from "react-router-dom";
import { STORE_NAME } from "../config";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-brand">{STORE_NAME}</p>
          <p>Fresh groceries, delivered to your door.</p>
        </div>
        <nav aria-label="Footer">
          <Link to="/products">All products</Link>
          <Link to="/cart">Your cart</Link>
          <Link to="/login">Log in</Link>
        </nav>
        <p className="footer-copy">© {new Date().getFullYear()} {STORE_NAME}</p>
      </div>
    </footer>
  );
}
