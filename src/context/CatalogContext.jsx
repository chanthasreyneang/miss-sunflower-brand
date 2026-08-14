import { createContext, useContext, useEffect, useState } from "react";
import { subscribeProducts } from "../services/productService";
import { subscribeCategories } from "../services/categoryService";
import { isFirebaseConfigured } from "../services/firebase";

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      setError("firebase-not-configured");
      return undefined;
    }

    let productsLoaded = false;
    let categoriesLoaded = false;
    const checkDone = () => {
      if (productsLoaded && categoriesLoaded) setLoading(false);
    };

    const unsubProducts = subscribeProducts(
      (data) => {
        setProducts(data);
        productsLoaded = true;
        checkDone();
      },
      (err) => {
        setError(err.message);
        productsLoaded = true;
        checkDone();
      }
    );

    const unsubCategories = subscribeCategories(
      (data) => {
        setCategories(data);
        categoriesLoaded = true;
        checkDone();
      },
      (err) => {
        setError(err.message);
        categoriesLoaded = true;
        checkDone();
      }
    );

    return () => {
      unsubProducts();
      unsubCategories();
    };
  }, []);

  return (
    <CatalogContext.Provider value={{ products, categories, loading, error }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
