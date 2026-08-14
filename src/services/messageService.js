import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export function addContactMessage(data) {
  return addDoc(collection(db, "contactMessages"), { ...data, createdAt: serverTimestamp() });
}

export function addFeedback(data) {
  return addDoc(collection(db, "feedback"), { ...data, createdAt: serverTimestamp() });
}

export function addNewsletterSignup(email) {
  return addDoc(collection(db, "newsletterSignups"), { email, createdAt: serverTimestamp() });
}
