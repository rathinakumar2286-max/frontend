import api from "./api";

// Returns { data: [...products], pagination }
export const list = (params) => api.get("/products", { params }).then((r) => r.data);
export const get = (id) => api.get(`/products/${id}`).then((r) => r.data.data);
export const brands = () => api.get("/brands").then((r) => r.data.data);
export const categories = () => api.get("/categories").then((r) => r.data.data);
