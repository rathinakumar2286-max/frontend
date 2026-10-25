import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as cartService from "../services/cart.service";
import { errorMessage } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const EMPTY = { items: [], summary: { itemCount: 0, subtotal: 0, mrpTotal: 0, savings: 0, deliveryCharge: 0, total: 0, freeDeliveryAbove: 0 } };

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [busyProductId, setBusyProductId] = useState(null);
  const [notice, setNotice] = useState("");

  // Load the cart when someone logs in, clear it when they log out.
  useEffect(() => {
    if (!user) {
      setCart(EMPTY);
      return;
    }
    setLoading(true);
    cartService
      .get()
      .then(setCart)
      .catch((e) => setNotice(errorMessage(e)))
      .finally(() => setLoading(false));
  }, [user]);

  // Runs a cart change, shows any server message (e.g. "out of stock") and keeps the cart in sync.
  const run = useCallback(async (productId, action) => {
    setBusyProductId(productId);
    try {
      setCart(await action());
      return true;
    } catch (e) {
      setNotice(errorMessage(e));
      return false;
    } finally {
      setBusyProductId(null);
    }
  }, []);

  const findItem = useCallback((productId) => cart.items.find((i) => i.productId === productId), [cart.items]);

  const addToCart = useCallback((productId, quantity = 1) => run(productId, () => cartService.add(productId, quantity)), [run]);

  const setQuantity = useCallback(
    (productId, quantity) => {
      const item = findItem(productId);
      if (!item) return addToCart(productId, quantity);
      return run(productId, () => cartService.setQuantity(item.id, quantity));
    },
    [findItem, addToCart, run]
  );

  const value = useMemo(
    () => ({
      items: cart.items,
      summary: cart.summary,
      loading,
      busyProductId,
      notice,
      clearNotice: () => setNotice(""),
      quantityOf: (productId) => findItem(productId)?.quantity ?? 0,
      addToCart,
      setQuantity,
    }),
    [cart, loading, busyProductId, notice, findItem, addToCart, setQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
