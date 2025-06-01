import { useEffect, useState, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faTrashAlt,
  faTrashRestoreAlt,
} from "@fortawesome/free-solid-svg-icons";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import TypingIndicator from "../TypingIndicator/TypingIndicator";
import { rtdb } from "../firebase/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { motion, AnimatePresence } from "framer-motion";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { currentUser } = useAuth();
  const { selectedUser } = useChat();
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const endRef = useRef(null);
  const [showMenuId, setShowMenuId] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const combinedId =
    currentUser?.uid > selectedUser?.uid
      ? currentUser.uid + selectedUser.uid
      : selectedUser?.uid + currentUser?.uid;

  // Firestore document reference for typing status
  const typingRef = doc(db, "typingStatus", combinedId);

  // Initialize Pusher and subscribe to the channel
  // Effect for handling Pusher typing events
  useEffect(() => {
    if (!selectedUser) return;

    const unsubscribe = onSnapshot(typingRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Check if the other user is typing
        setIsTyping(data[selectedUser.uid] === true);
      }
    });

    return () => unsubscribe(); // Cleanup the Firestore listener
  }, [selectedUser, combinedId]); // Add dependencies
  const handleEmojiSelect = async (emojiData, messageId) => {
    const messageRef = doc(db, "chats", combinedId, "messages", messageId);
    const selectedEmoji = emojiData.emoji;
    try {
      const msgToUpdate = messages.find((m) => m.id === messageId);
      if (msgToUpdate) {
        const newText = (msgToUpdate.text || "") + " " + selectedEmoji;
        await updateDoc(messageRef, { text: newText });
        setShowEmojiPicker(null);
      }
    } catch (err) {
      console.error("Failed to react with emoji:", err);
    }
  };

  const editMessage = async (messageId) => {
    const messageRef = doc(db, "chats", combinedId, "messages", messageId);
    try {
      await updateDoc(messageRef, { text: editText });
      setEditingMessageId(null);
      setEditText("");
    } catch (error) {
      console.error("Error updating the message", error);
    }
  };

  const deleteForMe = async (messageId) => {
    try {
      await deleteDoc(doc(db, "chats", combinedId, "messages", messageId));
      setShowMenuId(null);
    } catch (error) {
      console.error("Error deleting for me:", error);
    }
  };

  const deleteForEveryone = async (messageId) => {
    try {
      const messageRef = doc(db, "chats", combinedId, "messages", messageId);
      await updateDoc(messageRef, {
        text: "🗑️ This message was deleted.",
        deleted: true,
      });
      setShowMenuId(null);
    } catch (error) {
      console.error("Error deleting for everyone:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".menu-popup")) {
        setShowMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    const q = query(
      collection(db, "chats", combinedId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [currentUser, selectedUser]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-[#111b21] text-white relative">
      {isTyping && <TypingIndicator />}
      <AnimatePresence initial={false}>
        {messages.map((msg) => {
          const isSender = msg.uid === currentUser.uid;
          return (
            <motion.div
              key={msg.id}
              className={`flex ${
                isSender ? "justify-end" : "justify-start"
              } mb-3 group relative`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`max-w-[75%] px-4 py-2 text-sm rounded-xl break-words relative ${
                  isSender
                    ? "bg-[#005c4b] text-white rounded-br-none"
                    : "bg-[#202c33] text-white rounded-bl-none"
                } shadow-sm`}
              >
                {!isSender && msg.displayName && !msg.deleted && (
                  <div className="text-white font-semibold text-xs mb-1 border-l-2 border-green-500 pl-2">
                    {msg.displayName}
                  </div>
                )}

                {editingMessageId === msg.id ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full bg-[#2a3942] text-white rounded-lg px-3 py-2 resize-none"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => {
                          setEditingMessageId(null);
                          setEditText("");
                        }}
                        className="text-xs text-gray-400 hover:underline"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => editMessage(msg.id)}
                        className="text-xs text-green-400 hover:underline"
                      >
                        Save
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {msg.deleted ? (
                      <div className="italic text-gray-300">{msg.text}</div>
                    ) : (
                      <>
                        {msg.text && <div>{msg.text}</div>}
                        {msg.fileUrl &&
                          (msg.fileType && msg.fileType.startsWith("image/") ? (
                            <img
                              src={msg.fileUrl}
                              alt="sent"
                              className="rounded-lg mt-2 max-h-64 object-cover"
                            />
                          ) : (
                            <a
                              href={msg.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-300 underline mt-2 block"
                            >
                              📎 Download File
                            </a>
                          ))}
                      </>
                    )}
                  </>
                )}

                <div className="text-[10px] text-gray-400 mt-1 text-right">
                  {msg.createdAt?.toDate().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                {isSender && !msg.deleted && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenuId((prev) =>
                        prev === msg.id ? null : msg.id
                      );
                    }}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                  >
                    <FontAwesomeIcon
                      icon={faEllipsisVertical}
                      className="text-[18px]"
                    />
                  </button>
                )}
                <AnimatePresence>
                  {showMenuId === msg.id && (
                    <motion.div
                      className="menu-popup absolute top-10 right-2 z-50 bg-[#233138] shadow-lg rounded-xl overflow-hidden text-sm ring-1 ring-white/10"
                      onClick={(e) => e.stopPropagation()}
                      initial={{
                        opacity: 0,
                        scale: 0.9,
                        originX: "100%",
                        originY: "0%",
                      }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{
                        opacity: 0,
                        scale: 0.9,
                        originX: "100%",
                        originY: "0%",
                      }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                      <button
                        onClick={() => deleteForMe(msg.id)}
                        className="w-full text-left px-4 py-3 hover:bg-green-700 text-white"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                        Delete for Me
                      </button>
                      <button
                        onClick={() => deleteForEveryone(msg.id)}
                        className="w-full text-left px-4 py-3 hover:bg-red-600 text-white"
                      >
                        <FontAwesomeIcon
                          icon={faTrashRestoreAlt}
                          className="mr-2"
                        />
                        Delete for Everyone
                      </button>
                      <button
                        onClick={() => setShowEmojiPicker(msg.id)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-600 text-white"
                      >
                        😊 React
                      </button>
                      <button
                        onClick={() => {
                          setEditingMessageId(msg.id);
                          setEditText(msg.text);
                          setShowMenuId(null);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-600 text-white"
                      >
                        ✏️ Edit Message
                      </button>
                      {msg.edited && (
                        <p className="text-xs text-gray-400 italic mt-1">
                          Message was edited
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {showEmojiPicker === msg.id && (
                  <motion.div
                    className="absolute top-10 right-12 z-50 bg-[#f0f0f0] border border-gray-300 rounded-lg shadow-sm p-1"
                    onClick={(e) => e.stopPropagation()}
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                      originX: "100%",
                      originY: "0%",
                    }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      originX: "100%",
                      originY: "0%",
                    }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  >
                    <EmojiPicker
                      onEmojiClick={(emojiData) =>
                        handleEmojiSelect(emojiData, msg.id)
                      }
                      emojiStyle="native"
                      lazyLoadEmojis
                      theme="light"
                      searchDisabled
                      skinTonesDisabled
                      height={300}
                      width={280}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <div ref={endRef}></div>
    </div>
  );
};

export default Messages;
