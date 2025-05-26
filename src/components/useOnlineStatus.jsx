// hooks/useOnlineStatus.js
import { useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const useOnlineStatus = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);

        await setDoc(
          userRef,
          {
            online: true,
            lastSeen: serverTimestamp(),
          },
          { merge: true }
        );

        const handleOffline = async () => {
          await setDoc(
            userRef,
            {
              online: false,
              lastSeen: serverTimestamp(),
            },
            { merge: true }
          );
        };

        window.addEventListener("beforeunload", handleOffline);
      }
    });

    return () => unsubscribe();
  }, []);
};

export default useOnlineStatus;
