import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// db is null until Firebase is configured (see firebase.js), so the
// collection ref is computed lazily per-call rather than at module load.
const productsRef = () => collection(db, "products");

export function subscribeProducts(onChange, onError) {
  const q = query(productsRef(), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

export function addProduct(product) {
  return addDoc(productsRef(), { ...product, createdAt: serverTimestamp() });
}

export function updateProduct(id, product) {
  return updateDoc(doc(db, "products", id), product);
}

export function deleteProduct(id) {
  return deleteDoc(doc(db, "products", id));
}

export async function seedProductsBatch(products) {
  const batch = writeBatch(db);
  products.forEach((product) => {
    const ref = doc(productsRef());
    batch.set(ref, { ...product, createdAt: serverTimestamp() });
  });
  await batch.commit();
}
