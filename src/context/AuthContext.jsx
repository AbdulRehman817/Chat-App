import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db, rtdb } from "../firebase/firebaseConfig"; // Ensure rtdb is imported
import { doc, updateDoc } from "firebase/firestore";
import { ref, set } from "firebase/database"; // Import ref and set from Realtime Database

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // track loading state

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { online: true });
      } else {
        setCurrentUser(null);
      }
      setLoading(false); // finished loading after first auth check
    });

    return () => unsub();
  }, []);

  // This is the useEffect hook you should have in your AuthProvider
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, { online: false });
        // Also set status to false in Realtime Database on unload
        const userRtdbRef = ref(rtdb, "users/" + auth.currentUser.uid);
        await set(userRtdbRef, false);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentUser]);

  const logout = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { online: false });
      // Set status to false in Realtime Database on logout
      const userRtdbRef = ref(rtdb, "users/" + auth.currentUser.uid);
      await set(userRtdbRef, false);
      await signOut(auth);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
