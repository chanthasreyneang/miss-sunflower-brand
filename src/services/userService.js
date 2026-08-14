import { doc, setDoc, getDoc, updateDoc, onSnapshot, collection, getCountFromServer } from "firebase/firestore";
import { db } from "./firebase";

export function createUserProfile(uid, data) {
  return setDoc(doc(db, "users", uid), {
    role: "customer",
    wishlist: [],
    ...data,
    createdAt: new Date().toISOString(),
  });
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export function subscribeUserProfile(uid, onChange, onError) {
  return onSnapshot(
    doc(db, "users", uid),
    (snap) => onChange(snap.exists() ? { id: snap.id, ...snap.data() } : null),
    onError
  );
}

export function updateWishlist(uid, wishlist) {
  return updateDoc(doc(db, "users", uid), { wishlist });
}

export async function getUserCount() {
  const snap = await getCountFromServer(collection(db, "users"));
  return snap.data().count;
}
