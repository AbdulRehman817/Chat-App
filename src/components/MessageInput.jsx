import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { currentUser } = useAuth();
  const { selectedUser } = useChat();

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() || !selectedUser) return;

    const combinedId =
      currentUser.uid > selectedUser.uid
        ? currentUser.uid + selectedUser.uid
        : selectedUser.uid + currentUser.uid;

    try {
      await addDoc(collection(db, "chats", combinedId, "messages"), {
        text: message,
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        createdAt: serverTimestamp(),
      });
      setMessage("");
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
      onSubmit={handleSendMessage}
      className="flex items-center gap-2 p-4 bg-white border-t border-gray-300"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={`Message @${selectedUser.displayName}`}
        className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
      />
      <button
        type="submit"
        disabled={!message.trim()}
        className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
