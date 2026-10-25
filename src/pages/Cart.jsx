import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import ProductImage from "../components/ProductImage";
import CartControl from "../components/CartControl";

export default function Cart() {
  const { items, summary, loading, setQuantity, busyProductId } = useCart();

  if (loading) return <p className="page-note">Loading your cart…</p>;

  if (items.length === 0) {
    return (
      <div className="container empty">
        <h1>Your cart is empty</h1>
        <p>Add a few things and they’ll show up here.</p>
        <Link className="btn" to="/products">
          Start shopping
        </Link>
      </div>
    );
  }

  const toFree = Math.max(summary.freeDeliveryAbove - summary.subtotal, 0);

  return (
    <div className="container">
      <h1 className="page-title">Your cart</h1>
      <div className="cart">
        <ul className="cart-list">
          {items.map((item) => (
            <li key={item.id} className={`cart-row ${item.available ? "" : "is-unavailable"}`}>
              <Link to={`/products/${item.productId}`} className="cart-thumb">
                <ProductImage imageUrl={item.imageUrl} name={item.name} category={item.category} />
              </Link>
              <div className="cart-info">
                <Link to={`/products/${item.productId}`} className="pcard-name">
                  {item.name}
                </Link>
                <p className="muted small">{item.unit}</p>
                {!item.available && (
                  <p className="warn small">
                    {item.stock === 0 ? "Out of stock now." : `Only ${item.stock} available.`} Change the quantity or remove it.
                  </p>
                )}
              </div>
              <div className="cart-qty">
                <CartControl product={{ id: item.productId, name: item.name, stock: item.stock, maxOrderQuantity: item.maxQuantity }} />
                <button className="link-btn small" disabled={busyProductId === item.productId} onClick={() => setQuantity(item.productId, 0)}>
                  Remove
                </button>
              </div>
              <p className="cart-line">{formatPrice(item.lineTotal)}</p>
            </li>
          ))}
        </ul>

        <aside className="summary" aria-label="Order summary">
          <h2>Order summary</h2>
          <dl>
            <div>
              <dt>Items ({summary.itemCount})</dt>
              <dd>{formatPrice(summary.mrpTotal)}</dd>
            </div>
            {summary.savings > 0 && (
              <div className="save">
                <dt>Discount</dt>
                <dd>−{formatPrice(summary.savings)}</dd>
              </div>
            )}
            <div>
              <dt>Delivery</dt>
              <dd>{summary.deliveryCharge === 0 ? "Free" : formatPrice(summary.deliveryCharge)}</dd>
            </div>
            <div className="total">
              <dt>Total</dt>
              <dd>{formatPrice(summary.total)}</dd>
            </div>
          </dl>
          {toFree > 0 && summary.subtotal > 0 && (
            <p className="free-hint">Add {formatPrice(toFree)} more to get free delivery.</p>
          )}
          <Link className="btn btn-block" to="/checkout">
            Continue to checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
