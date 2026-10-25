import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// "Add" button that turns into a − 1 + stepper once the item is in the cart.
export default function CartControl({ product, large = false }) {
  const { user } = useAuth();
  const { quantityOf, addToCart, setQuantity, busyProductId } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const qty = quantityOf(product.id);
  const busy = busyProductId === product.id;
  const limit = Math.min(product.stock, product.maxOrderQuantity);
  const size = large ? "cc cc-large" : "cc";

  if (product.stock < 1) {
    return (
      <button className={`${size} cc-off`} disabled>
        Out of stock
      </button>
    );
  }

  if (qty === 0) {
    const onAdd = () => {
      if (!user) return navigate("/login", { state: { from: location } });
      addToCart(product.id, 1);
    };
    return (
      <button className={`${size} cc-add`} onClick={onAdd} disabled={busy}>
        Add to cart
      </button>
    );
  }

  return (
    <div className={`${size} cc-step`} role="group" aria-label={`Quantity of ${product.name}`}>
      <button onClick={() => setQuantity(product.id, qty - 1)} disabled={busy} aria-label="Decrease quantity">
        −
      </button>
      <span aria-live="polite">{qty}</span>
      <button onClick={() => setQuantity(product.id, qty + 1)} disabled={busy || qty >= limit} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}
