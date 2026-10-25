import { Link } from "react-router-dom";

// Placeholder: the real checkout (address, delivery slot, payment, order creation) is the next build step.
export default function Checkout() {
  return (
    <div className="container empty">
      <h1>Checkout isn’t available yet</h1>
      <p>Your cart is saved. Address, delivery slot and payment are coming in the next step.</p>
      <Link className="btn" to="/cart">
        Back to cart
      </Link>
    </div>
  );
}
