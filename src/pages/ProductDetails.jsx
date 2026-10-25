import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as productService from "../services/product.service";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import ProductImage from "../components/ProductImage";
import CartControl from "../components/CartControl";
import ProductGrid from "../components/ProductGrid";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, quantityOf } = useCart();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | missing | error
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setStatus("loading");
    setActiveImage(0);
    window.scrollTo({ top: 0 });
    productService
      .get(id)
      .then((p) => {
        setProduct(p);
        setStatus("ready");
      })
      .catch((e) => setStatus(e.response?.status === 404 ? "missing" : "error"));
  }, [id]);

  if (status === "loading") return <p className="page-note">Loading product…</p>;
  if (status !== "ready") {
    return (
      <div className="container empty">
        <h1>{status === "missing" ? "This product isn’t available" : "We couldn’t load this product"}</h1>
        <Link className="btn" to="/products">
          Browse all products
        </Link>
      </div>
    );
  }

  const images = [...new Set([product.imageUrl, ...product.images].filter(Boolean))];
  const hasDiscount = product.discountPercent > 0;
  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 10;

  const buyNow = async () => {
    if (!user) return navigate("/login", { state: { from: { pathname: `/products/${product.id}` } } });
    if (quantityOf(product.id) === 0) {
      const ok = await addToCart(product.id, 1);
      if (!ok) return;
    }
    navigate("/cart");
  };

  return (
    <div className="container">
      <p className="crumbs">
        <Link to="/products">All products</Link> / <span>{product.category}</span>
      </p>

      <div className="detail">
        <div className="gallery">
          <div className="gallery-main">
            <ProductImage imageUrl={images[activeImage]} name={product.name} category={product.category} />
          </div>
          {images.length > 1 && (
            <ul className="gallery-thumbs">
              {images.map((src, i) => (
                <li key={src}>
                  <button className={i === activeImage ? "is-active" : ""} onClick={() => setActiveImage(i)} aria-label={`Show photo ${i + 1}`}>
                    <img src={src} alt="" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="detail-info">
          {product.brand && <p className="muted">{product.brand}</p>}
          <h1>{product.name}</h1>
          <p className="muted">{product.unit}</p>

          <div className="price-row price-row-large">
            <span className="price">{formatPrice(product.sellingPrice)}</span>
            {hasDiscount && (
              <>
                <s className="mrp">{formatPrice(product.price)}</s>
                <span className="tag tag-inline">{Math.round(product.discountPercent)}% off</span>
              </>
            )}
          </div>
          <p className="muted small">Inclusive of all taxes</p>

          <p className={`stock ${inStock ? (lowStock ? "stock-low" : "stock-ok") : "stock-out"}`}>
            {!inStock ? "Out of stock" : lowStock ? `Only ${product.stock} left` : "In stock"}
          </p>

          <div className="detail-actions">
            <CartControl product={product} large />
            {inStock && (
              <button className="btn btn-ghost" onClick={buyNow}>
                Buy now
              </button>
            )}
          </div>

          {product.description && (
            <section className="detail-desc">
              <h2>About this item</h2>
              <p>{product.description}</p>
            </section>
          )}
        </div>
      </div>

      {product.related.length > 0 && (
        <section className="block" aria-labelledby="related">
          <h2 id="related">You might also need</h2>
          <ProductGrid products={product.related} />
        </section>
      )}
    </div>
  );
}
