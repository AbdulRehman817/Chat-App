import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

import { useChat } from "../context/ChatContext";

const SendMessage = () => {
  const [text, setText] = useState("");
  const { currentUser } = useAuth();
  const { selectedUser } = useChat();

  const handleSend = async (e) => {
    e.preventDefault();

    if (!text.trim() || !selectedUser) return;

    const combinedId =
      currentUser.uid > selectedUser.uid
        ? currentUser.uid + selectedUser.uid
        : selectedUser.uid + currentUser.uid;

    try {
      await addDoc(collection(db, "chats", combinedId, "messages"), {
        text,
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        createdAt: serverTimestamp(),
      });

      setText("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  if (!selectedUser) {
    return (
      <div className="p-4 text-center text-gray-500">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSend}
      className="flex items-center gap-2 p-4 bg-white border-t border-gray-200"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Message @${selectedUser.displayName}`}
        className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="bg-pink-500 text-white px-5 py-2 rounded-full hover:bg-pink-600 disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
};

export default SendMessage;
