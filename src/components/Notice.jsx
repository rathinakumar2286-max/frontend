import { useEffect } from "react";
import { useCart } from "../context/CartContext";

// Small message at the bottom of the screen for cart errors such as "out of stock".
export default function Notice() {
  const { notice, clearNotice } = useCart();
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(clearNotice, 4000);
    return () => clearTimeout(t);
  }, [notice, clearNotice]);

  if (!notice) return null;
  return (
    <div className="notice" role="status">
      {notice}
      <button onClick={clearNotice} aria-label="Dismiss message">×</button>
    </div>
  );
}
