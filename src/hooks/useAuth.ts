import { useState, useEffect } from "react";
import { auth, db } from "@/src/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export function useAuth() {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Ensure user profile exists
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            name: user.displayName || "Parent",
            email: user.email,
            role: "parent",
            createdAt: new Date().toISOString()
          });
        }
      }
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithDevice = async (deviceId: string, password: string, name?: string) => {
    // We use the device ID to create a unique pseudo-email for Firebase Auth
    const email = `${deviceId.replace(/[^a-zA-Z0-9]/g, '')}@smartbaby.local`;
    try {
      // Try to sign in first
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      // If sign in fails, try to create the account
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCredential.user, { displayName: name });
        }
      } catch (createError: any) {
        if (createError.code === 'auth/email-already-in-use') {
          throw new Error("Incorrect password for this device.");
        }
        throw createError;
      }
    }
  };

  const logout = () => signOut(auth);

  return { user, loading, loginWithDevice, logout };
}
