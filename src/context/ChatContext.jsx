 // context/ChatContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  // Real-time tracking of selectedUser's online status
  useEffect(() => {
    if (!selectedUser?.uid) return;

    const unsubscribe = onSnapshot(
      doc(db, "users", selectedUser.uid),
      (docSnap) => {
        if (docSnap.exists()) {
          setSelectedUser((prev) => ({ ...prev, ...docSnap.data() }));
        }
      }
    );

    return () => unsubscribe();
  }, [selectedUser?.uid]);

  return (
    <ChatContext.Provider value={{ selectedUser, setSelectedUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
