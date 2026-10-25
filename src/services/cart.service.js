import api from "./api";

// Every call returns { items, summary }
export const get = () => api.get("/cart").then((r) => r.data.data);
export const add = (productId, quantity = 1) =>
  api.post("/cart/items", { productId, quantity }).then((r) => r.data.data);
export const setQuantity = (itemId, quantity) =>
  api.put(`/cart/items/${itemId}`, { quantity }).then((r) => r.data.data);
export const remove = (itemId) => api.delete(`/cart/items/${itemId}`).then((r) => r.data.data);
