import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const ordersRef = () => collection(db, "orders");

export function createOrder(order) {
  return addDoc(ordersRef(), {
    ...order,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export function subscribeAllOrders(onChange, onError) {
  const q = query(ordersRef(), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

export function subscribeUserOrders(uid, onChange, onError) {
  const q = query(ordersRef(), where("userId", "==", uid), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

export function updateOrderStatus(id, status) {
  return updateDoc(doc(db, "orders", id), { status });
}
