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
} from "firebase/firestore";
import { db } from "./firebase";

const categoriesRef = () => collection(db, "categories");

export function subscribeCategories(onChange, onError) {
  const q = query(categoriesRef(), orderBy("name", "asc"));
  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

export function addCategory(category) {
  return addDoc(categoriesRef(), category);
}

export function updateCategory(id, category) {
  return updateDoc(doc(db, "categories", id), category);
}

export function deleteCategory(id) {
  return deleteDoc(doc(db, "categories", id));
}

export async function seedCategoriesBatch(categories) {
  const batch = writeBatch(db);
  categories.forEach((category) => {
    const ref = doc(categoriesRef());
    batch.set(ref, category);
  });
  await batch.commit();
}
