// import { useEffect, useState, useRef } from "react";
// import EmojiPicker from "emoji-picker-react";
// import {
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   doc,
//   deleteDoc,
//   updateDoc,
// } from "firebase/firestore";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faEllipsisVertical,
//   faTrashAlt,
//   faTrashRestoreAlt,
// } from "@fortawesome/free-solid-svg-icons";

// import { db } from "../firebase/firebaseConfig";
// import { useAuth } from "../context/AuthContext";
// import { useChat } from "../context/ChatContext";

// const Messages = () => {
//   const [messages, setMessages] = useState([]);
//   const { currentUser } = useAuth();
//   const { selectedUser } = useChat();
//   const [showEmojiPicker, setShowEmojiPicker] = useState(null);
//   const endRef = useRef(null);
//   const [showMenuId, setShowMenuId] = useState(null);
//   const [editingMessageId, setEditingMessageId] = useState(null);
//   const [editText, setEditText] = useState("");
//   const [isTyping, setIsTyping] = useState(false);

//   const combinedId =
//     currentUser?.uid > selectedUser?.uid
//       ? currentUser.uid + selectedUser.uid
//       : selectedUser?.uid + currentUser?.uid;

//   useEffect(() => {
//     if (!selectedUser) return;
//     const typingRef = doc(db, "typingStatus", combinedId);
//     const unsubscribe = onSnapshot(typingRef, (docSnap) => {
//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         setIsTyping(data[selectedUser.uid] === true);
//       }
//     });
//     return () => unsubscribe();
//   }, [selectedUser, combinedId]);

//   const handleEmojiSelect = async (emojiData, messageId) => {
//     const messageRef = doc(db, "chats", combinedId, "messages", messageId);
//     const selectedEmoji = emojiData.emoji;
//     try {
//       const msgToUpdate = messages.find((m) => m.id === messageId);
//       if (msgToUpdate) {
//         const newText = (msgToUpdate.text || "") + " " + selectedEmoji;
//         await updateDoc(messageRef, { text: newText });
//         setShowEmojiPicker(null);
//       }
//     } catch (err) {
//       console.error("Failed to react with emoji:", err);
//     }
//   };

//   const editMessage = async (messageId) => {
//     const messageRef = doc(db, "chats", combinedId, "messages", messageId);
//     try {
//       await updateDoc(messageRef, { text: editText });
//       setEditingMessageId(null);
//       setEditText("");
//     } catch (error) {
//       console.error("Error updating the message", error);
//     }
//   };

//   const deleteForMe = async (messageId) => {
//     try {
//       await deleteDoc(doc(db, "chats", combinedId, "messages", messageId));
//       setShowMenuId(null);
//     } catch (error) {
//       console.error("Error deleting for me:", error);
//     }
//   };

//   const deleteForEveryone = async (messageId) => {
//     try {
//       const messageRef = doc(db, "chats", combinedId, "messages", messageId);
//       await updateDoc(messageRef, {
//         text: "🗑️ This message was deleted.",
//         deleted: true,
//       });
//       setShowMenuId(null);
//     } catch (error) {
//       console.error("Error deleting for everyone:", error);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest(".menu-popup")) {
//         setShowMenuId(null);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     if (!selectedUser) return;
//     const q = query(
//       collection(db, "chats", combinedId, "messages"),
//       orderBy("createdAt", "asc")
//     );
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setMessages(msgs);
//     });
//     return () => unsubscribe();
//   }, [currentUser, selectedUser]);

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div className="flex-1 overflow-y-auto p-4 bg-[#111b21] text-white relative">
//       {isTyping && (
//         <div className="text-sm text-gray-400 italic mb-2">
//           {selectedUser?.displayName || "User"} is typing...
//         </div>
//       )}

//       {messages.map((msg) => {
//         const isSender = msg.uid === currentUser.uid;
//         return (
//           <div
//             key={msg.id}
//             className={`flex ${
//               isSender ? "justify-end" : "justify-start"
//             } mb-3 relative group`}
//           >
//             <div
//               className={`max-w-[75%] px-5 py-3 text-sm relative rounded-xl shadow-lg ${
//                 isSender
//                   ? "bg-gradient-to-r from-green-600 to-green-500 text-white rounded-br-none"
//                   : "bg-[#202c33] text-white rounded-bl-none"
//               }`}
//             >
//               {!isSender && msg.displayName && !msg.deleted && (
//                 <div className="text-white font-semibold text-xs mb-1 border-l-2 border-green-500 pl-2 select-none">
//                   {msg.displayName}
//                 </div>
//               )}

//               {editingMessageId === msg.id ? (
//                 <div>
//                   <textarea
//                     value={editText}
//                     onChange={(e) => setEditText(e.target.value)}
//                     className="w-full bg-[#2a3942] text-white rounded-lg px-3 py-2 resize-none"
//                   />
//                   <div className="flex gap-2 justify-end mt-2">
//                     <button
//                       onClick={() => {
//                         setEditingMessageId(null);
//                         setEditText("");
//                       }}
//                       className="text-xs text-gray-300 hover:underline"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={() => editMessage(msg.id)}
//                       className="text-xs text-green-300 hover:underline"
//                     >
//                       Save
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   {/* Display text */}
//                   {msg.deleted ? (
//                     <div className="italic text-gray-200">{msg.text}</div>
//                   ) : (
//                     <>
//                       {msg.text && <div>{msg.text}</div>}
//                       {/* Display image */}
//                       {msg.imageUrl && (
//                         <img
//                           src={msg.imageUrl}
//                           alt="Sent file"
//                           className="rounded-lg mt-2 max-h-64"
//                         />
//                       )}
//                       {/* Display file */}
//                       {msg.fileUrl && (
//                         <a
//                           href={msg.fileUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-400 underline mt-2 block"
//                         >
//                           📎 Download File
//                         </a>
//                       )}
//                     </>
//                   )}
//                 </>
//               )}

//               <div className="text-[11px] text-right mt-1 text-gray-300 select-none">
//                 {msg.createdAt?.toDate().toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </div>

//               {isSender && !msg.deleted && (
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setShowMenuId((prev) => (prev === msg.id ? null : msg.id));
//                   }}
//                   className="absolute top-2 right-2 text-gray-400 hover:text-white p-1 rounded-full transition duration-200"
//                   title="Options"
//                 >
//                   <FontAwesomeIcon
//                     icon={faEllipsisVertical}
//                     className="text-[22px]"
//                   />
//                 </button>
//               )}

//               {showMenuId === msg.id && (
//                 <div
//                   className="menu-popup absolute top-10 right-2 bg-[#1f2c34]/90 backdrop-blur-md rounded-xl shadow-2xl py-2 w-48 z-50 ring-1 ring-white/20 animate-fadeInScale"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <button
//                     onClick={() => deleteForMe(msg.id)}
//                     className="flex items-center gap-3 w-full text-left px-5 py-3 text-gray-300 hover:bg-green-600 hover:text-white transition duration-200 font-semibold"
//                   >
//                     <FontAwesomeIcon icon={faTrashAlt} />
//                     Delete for Me
//                   </button>
//                   <button
//                     onClick={() => deleteForEveryone(msg.id)}
//                     className="flex items-center gap-3 w-full text-left px-5 py-3 text-gray-300 hover:bg-red-600 hover:text-white transition duration-200 font-semibold"
//                   >
//                     <FontAwesomeIcon icon={faTrashRestoreAlt} />
//                     Delete for Everyone
//                   </button>
//                   <button
//                     onClick={() => setShowEmojiPicker(msg.id)}
//                     className="flex items-center gap-3 w-full text-left px-5 py-3 text-gray-300 hover:bg-blue-600 hover:text-white transition duration-200 font-semibold"
//                   >
//                     😊 React
//                   </button>
//                   <button
//                     onClick={() => {
//                       setEditingMessageId(msg.id);
//                       setEditText(msg.text);
//                       setShowMenuId(null);
//                     }}
//                     className="flex items-center gap-3 w-full text-left px-5 py-3 text-gray-300 hover:bg-blue-600 hover:text-white transition duration-200 font-semibold"
//                   >
//                     ✏️ Edit Message
//                   </button>
//                 </div>
//               )}
//             </div>

//             {showEmojiPicker === msg.id && (
//               <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
//                 <div className="bg-white rounded-xl shadow-lg p-2">
//                   <EmojiPicker
//                     onEmojiClick={(emojiData) =>
//                       handleEmojiSelect(emojiData, msg.id)
//                     }
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         );
//       })}

//       <div ref={endRef}></div>
//     </div>
//   );
// };

// export default Messages;

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

  useEffect(() => {
    if (!selectedUser) return;
    const typingRef = doc(db, "typingStatus", combinedId);
    const unsubscribe = onSnapshot(typingRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsTyping(data[selectedUser.uid] === true);
      }
    });
    return () => unsubscribe();
  }, [selectedUser, combinedId]);

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
      {isTyping && (
        <div className="text-sm text-gray-400 italic mb-2 pl-2">
          {selectedUser?.displayName || "User"} is typing...
        </div>
      )}

      {messages.map((msg) => {
        const isSender = msg.uid === currentUser.uid;
        return (
          <div
            key={msg.id}
            className={`flex ${
              isSender ? "justify-end" : "justify-start"
            } mb-3 group relative`}
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
                      {msg.imageUrl && (
                        <img
                          src={msg.imageUrl}
                          alt="sent"
                          className="rounded-lg mt-2 max-h-64 object-cover"
                        />
                      )}
                      {msg.fileUrl && (
                        <a
                          href={msg.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-300 underline mt-2 block"
                        >
                          📎 Download File
                        </a>
                      )}
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
                    setShowMenuId((prev) => (prev === msg.id ? null : msg.id));
                  }}
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                >
                  <FontAwesomeIcon
                    icon={faEllipsisVertical}
                    className="text-[18px]"
                  />
                </button>
              )}

              {showMenuId === msg.id && (
                <div
                  className="menu-popup absolute top-10 right-2 z-50 bg-[#233138] shadow-lg rounded-xl overflow-hidden text-sm ring-1 ring-white/10 animate-fadeInScale"
                  onClick={(e) => e.stopPropagation()}
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
                </div>
              )}
            </div>

            {showEmojiPicker === msg.id && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg p-2">
                  <EmojiPicker
                    onEmojiClick={(emojiData) =>
                      handleEmojiSelect(emojiData, msg.id)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div ref={endRef}></div>
    </div>
  );
};

export default Messages;
