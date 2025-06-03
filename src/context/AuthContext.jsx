// import { createContext, useContext, useEffect, useState } from "react";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { auth, db } from "../firebase/firebaseConfig";
// import { doc, updateDoc } from "firebase/firestore";
// import {
//   getDatabase,
//   ref,
//   set,
//   onDisconnect,
//   serverTimestamp,
// } from "firebase/database";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true); // track loading state

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         setCurrentUser(user);

//         const userRef = doc(db, "users", user.uid);
//         await updateDoc(userRef, { online: true });
//       } else {
//         setCurrentUser(null);
//       }
//       setLoading(false); // finished loading after first auth check
//     });

//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     const handleBeforeUnload = async () => {
//       if (auth.currentUser) {
//         const userRef = doc(db, "users", auth.currentUser.uid);
//         await updateDoc(userRef, { offline: true });
//       }
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => window.removeEventListener("beforeunload", handleBeforeUnload);
//   }, [currentUser]);

//   const logout = async () => {
//     if (auth.currentUser) {
//       const userRef = doc(db, "users", auth.currentUser.uid);
//       await updateDoc(userRef, { online: false });
//       await signOut(auth);
//     }
//     console.log("User logged out");
//     setCurrentUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ currentUser, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { getDatabase, ref, onDisconnect, set } from "firebase/database";
import { doc, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      const db = getDatabase();

      if (user) {
        setCurrentUser(user);

        // Reference to the user's status
        const userStatusRef = ref(db, `/status/${user.uid}`);

        // Values
        const isOnline = {
          state: "online",
          lastChanged: Date.now(),
        };
        const isOffline = {
          state: "offline",
          lastChanged: Date.now(),
        };

        // Handle disconnect
        onDisconnect(userStatusRef)
          .set(isOffline)
          .then(() => {
            set(userStatusRef, isOnline);
          });
      } else {
        setCurrentUser(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const logout = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { online: false });
      await signOut(auth);
    }
    console.log("User logged out");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
