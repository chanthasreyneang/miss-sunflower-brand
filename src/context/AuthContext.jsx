import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "../services/firebase";
import { createUserProfile, subscribeUserProfile, updateWishlist } from "../services/userService";

const AuthContext = createContext(null);

function requireFirebase() {
  if (!isFirebaseConfigured) {
    const err = new Error("Firebase isn't configured yet. See SETUP.md to connect your project.");
    err.code = "app/not-configured";
    throw err;
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  // Starts true so the gap between currentUser resolving and the profile
  // effect (below) actually running doesn't read as "not loading" — see
  // AdminRoute, which gates on this to avoid bouncing admins off /admin
  // before their role has arrived.
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return undefined;
    }
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    // Wait for auth to actually resolve before acting — currentUser starts
    // as null on mount, before Firebase has said whether anyone's logged in.
    // Reacting to that transient null would reset profileLoading to false
    // prematurely, only for the real user to arrive a tick later.
    if (loading) return undefined;

    if (!currentUser) {
      setProfile(null);
      setProfileLoading(false);
      return undefined;
    }
    // Route guards (AdminRoute) key off `profile.role` — without this flag
    // there's a window right after login/reload where currentUser exists but
    // the Firestore profile hasn't arrived yet, so isAdmin reads as false and
    // an admin gets bounced off /admin before their role loads.
    setProfileLoading(true);
    const unsubscribeProfile = subscribeUserProfile(
      currentUser.uid,
      (data) => {
        setProfile(data);
        setProfileLoading(false);
      },
      () => {
        setProfile(null);
        setProfileLoading(false);
      }
    );
    return unsubscribeProfile;
  }, [currentUser, loading]);

  const register = useCallback(async (name, email, password) => {
    requireFirebase();
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    await createUserProfile(credential.user.uid, { name, email });
    return credential.user;
  }, []);

  const login = useCallback(async (email, password, remember = true) => {
    requireFirebase();
    await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const logout = useCallback(() => {
    requireFirebase();
    return signOut(auth);
  }, []);

  const resetPassword = useCallback((email) => {
    requireFirebase();
    return sendPasswordResetEmail(auth, email);
  }, []);

  const toggleWishlist = useCallback(
    async (productId) => {
      if (!currentUser || !profile) return;
      const current = profile.wishlist || [];
      const next = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId];
      await updateWishlist(currentUser.uid, next);
    },
    [currentUser, profile]
  );

  const value = {
    currentUser,
    profile,
    role: profile?.role || "customer",
    isAdmin: profile?.role === "admin",
    wishlist: profile?.wishlist || [],
    loading,
    profileLoading,
    register,
    login,
    logout,
    resetPassword,
    toggleWishlist,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
