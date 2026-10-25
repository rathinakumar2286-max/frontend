import { useEffect, useState } from "react";
import { categories as fetchCategories } from "../services/product.service";

// Categories rarely change, so fetch once and share between Header, Home and Products.
let cache;

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    cache = cache || fetchCategories();
    cache.then(setCategories).catch(() => {
      cache = undefined;
    });
  }, []);
  return categories;
}
