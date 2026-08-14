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
      // Loud on purpose: this exact state (env vars missing at build time)
      // is what silently ships as "no products/categories" with no other
      // signal. If you're reading this in devtools on a deployed site, the
      // build didn't have VITE_FIREBASE_* set — see SETUP.md.
      console.warn(
        "[Firebase] Not configured — VITE_FIREBASE_* env vars were empty at build time. " +
          "Products/categories/auth will stay empty until they're set and the site is rebuilt."
      );
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
        console.error("[Firestore] products subscription failed:", err.code, err.message);
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
        console.error("[Firestore] categories subscription failed:", err.code, err.message);
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
