// // // import { useState, useRef, useEffect } from "react";
// // // import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// // // import { ref, set } from "firebase/database";
// // // import { db, rtdb } from "../firebase/firebaseConfig";
// // // import { useAuth } from "../context/AuthContext";
// // // import { useChat } from "../context/ChatContext";

// // // import { Paperclip, Send, X } from "lucide-react"; // added X icon for remove
// // // import { v4 as uuidv4 } from "uuid";

// // // const uploadFileToCloudinary = async (file, combinedId) => {
// // //   const formData = new FormData();

// // //   formData.append("upload_preset", "chat_uploads");
// // //   formData.append("folder", `chatFiles/${combinedId}`);
// // //   formData.append("file", file);

// // //   const response = await fetch(
// // //     "https://api.cloudinary.com/v1_1/dhvdjr4ie/upload",
// // //     {
// // //       method: "POST",
// // //       body: formData,
// // //     }
// // //   );

// // //   if (!response.ok) {
// // //     throw new Error("Cloudinary upload failed");
// // //   }

// // //   return await response.json();
// // // };

// // // const MessageInput = () => {
// // //   const [message, setMessage] = useState("");
// // //   const [selectedFile, setSelectedFile] = useState(null); // to hold the image file
// // //   const [previewUrl, setPreviewUrl] = useState(null); // to hold preview URL
// // //   const fileInputRef = useRef(null);
// // //   const typingTimeout = useRef(null);
// // //   const { currentUser } = useAuth();
// // //   const { selectedUser } = useChat();

// // //   useEffect(() => {
// // //     return () => {
// // //       if (typingTimeout.current) clearTimeout(typingTimeout.current);
// // //       // Clean up preview URL object when component unmounts or selectedFile changes
// // //       if (previewUrl) URL.revokeObjectURL(previewUrl);
// // //     };
// // //   }, [previewUrl]);

// // //   if (!selectedUser) {
// // //     return (
// // //       <div className="p-4 text-center text-gray-400 text-sm">
// // //         Select a user to start chatting
// // //       </div>
// // //     );
// // //   }

// // //   const combinedId =
// // //     currentUser.uid > selectedUser.uid
// // //       ? currentUser.uid + selectedUser.uid
// // //       : selectedUser.uid + currentUser.uid;

// // //   const typingRef = ref(rtdb, `typingStatus/${combinedId}/${currentUser.uid}`);

// // //   const handleTyping = (e) => {
// // //     setMessage(e.target.value);

// // //     if (e.target.value !== "") {
// // //       set(typingRef, true);
// // //       clearTimeout(typingTimeout.current);
// // //       typingTimeout.current = setTimeout(() => set(typingRef, false), 2000);
// // //     } else {
// // //       set(typingRef, false);
// // //     }
// // //   };

// // //   // When user picks a file, create a preview and hold file in state
// // //   const handleFileChange = (e) => {
// // //     const file = e.target.files[0];
// // //     if (!file) return;

// // //     // Clean up old preview URL if any
// // //     if (previewUrl) URL.revokeObjectURL(previewUrl);

// // //     setSelectedFile(file);
// // //     setPreviewUrl(URL.createObjectURL(file));

// // //     // Clear the file input to allow selecting same file again if needed
// // //     e.target.value = null;
// // //   };

// // //   // Remove the selected image preview and reset file
// // //   const handleRemovePreview = () => {
// // //     if (previewUrl) URL.revokeObjectURL(previewUrl);
// // //     setSelectedFile(null);
// // //     setPreviewUrl(null);
// // //   };

// // //   const handleSendMessage = async (e) => {
// // //     e.preventDefault();
// // //     if (!message.trim() && !selectedFile) return; // do nothing if no message or file

// // //     try {
// // //       if (selectedFile) {
// // //         // Upload file to Cloudinary
// // //         const uploadResult = await uploadFileToCloudinary(
// // //           selectedFile,
// // //           combinedId
// // //         );

// // //         // Send message with file info + text if exists
// // //         await addDoc(collection(db, "chats", combinedId, "messages"), {
// // //           text: message.trim() || null,
// // //           fileUrl: uploadResult.secure_url,
// // //           fileName: selectedFile.name,
// // //           fileType: selectedFile.type,
// // //           uid: currentUser.uid,
// // //           displayName: currentUser.displayName,
// // //           photoURL: currentUser.photoURL,
// // //           createdAt: serverTimestamp(),
// // //         });

// // //         // Clear selected file and preview after sending
// // //         handleRemovePreview();
// // //       } else {
// // //         // Send text only message
// // //         await addDoc(collection(db, "chats", combinedId, "messages"), {
// // //           text: message.trim(),
// // //           uid: currentUser.uid,
// // //           displayName: currentUser.displayName,
// // //           photoURL: currentUser.photoURL,
// // //           createdAt: serverTimestamp(),
// // //         });
// // //       }

// // //       setMessage("");
// // //       set(typingRef, false);
// // //     } catch (error) {
// // //       console.error("Send message failed:", error);
// // //     }
// // //   };

// // //   return (
// // //     <>
// // //       {/* Preview Section */}
// // //       {previewUrl && (
// // //         <div className="flex items-center p-2 bg-[#202c33] border-t border-gray-700">
// // //           <img
// // //             src={previewUrl}
// // //             alt="Selected file preview"
// // //             className="h-16 w-16 object-cover rounded-md"
// // //           />
// // //           <button
// // //             type="button"
// // //             onClick={handleRemovePreview}
// // //             className="ml-3 text-gray-400 hover:text-white"
// // //             title="Remove Image"
// // //           >
// // //             <X size={20} />
// // //           </button>
// // //         </div>
// // //       )}

// // //       <form
// // //         onSubmit={handleSendMessage}
// // //         className="flex items-center gap-3 px-4 py-3 bg-[#202c33] border-t border-gray-700"
// // //       >
// // //         {/* Attachment Icon */}
// // //         <button
// // //           type="button"
// // //           onClick={() => fileInputRef.current.click()}
// // //           className="text-gray-300 hover:text-white"
// // //           title="Attach File"
// // //         >
// // //           <Paperclip size={20} />
// // //         </button>

// // //         <input
// // //           type="file"
// // //           ref={fileInputRef}
// // //           className="hidden"
// // //           onChange={handleFileChange}
// // //           accept="image/*"
// // //         />

// // //         {/* Message Input */}
// // //         <input
// // //           type="text"
// // //           value={message}
// // //           onChange={handleTyping}
// // //           placeholder="Type a message"
// // //           className="flex-grow px-4 py-2 bg-[#2a3942] text-white border border-[#2a3942] rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
// // //         />

// // //         {/* Send Button */}
// // //         <button
// // //           type="submit"
// // //           disabled={!message.trim() && !selectedFile}
// // //           className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full disabled:opacity-50"
// // //           title="Send Message"
// // //         >
// // //           <Send size={16} />
// // //         </button>
// // //       </form>
// // //     </>
// // //   );
// // // };

// // // export default MessageInput;

// // import { useState, useRef, useEffect } from "react";
// // import {
// //   addDoc,
// //   collection,
// //   serverTimestamp,
// //   doc,
// //   setDoc,
// // } from "firebase/firestore";
// // import { ref, set } from "firebase/database";
// // import { db, rtdb } from "../firebase/firebaseConfig";
// // import { useAuth } from "../context/AuthContext";
// // import { useChat } from "../context/ChatContext";
// // import { Paperclip, Send, X } from "lucide-react";
// // import { v4 as uuidv4 } from "uuid";

// // const uploadFileToCloudinary = async (file, combinedId) => {
// //   const formData = new FormData();
// //   formData.append("upload_preset", "chat_uploads");
// //   formData.append("folder", `chatFiles/${combinedId}`);
// //   formData.append("file", file);

// //   const response = await fetch(
// //     "https://api.cloudinary.com/v1_1/dhvdjr4ie/upload",
// //     {
// //       method: "POST",
// //       body: formData,
// //     }
// //   );

// //   if (!response.ok) {
// //     throw new Error("Cloudinary upload failed");
// //   }

// //   return await response.json();
// // };

// // const MessageInput = () => {
// //   const [message, setMessage] = useState("");
// //   const [selectedFile, setSelectedFile] = useState(null);
// //   const [previewUrl, setPreviewUrl] = useState(null);
// //   const fileInputRef = useRef(null);
// //   const typingTimeout = useRef(null);
// //   const { currentUser } = useAuth();
// //   const { selectedUser } = useChat();

// //   useEffect(() => {
// //     return () => {
// //       if (typingTimeout.current) clearTimeout(typingTimeout.current);
// //       if (previewUrl) URL.revokeObjectURL(previewUrl);
// //     };
// //   }, [previewUrl]);

// //   if (!selectedUser) {
// //     return (
// //       <div className="p-4 text-center text-gray-400 text-sm">
// //         Select a user to start chatting
// //       </div>
// //     );
// //   }

// //   const combinedId =
// //     currentUser.uid > selectedUser.uid
// //       ? currentUser.uid + selectedUser.uid
// //       : selectedUser.uid + currentUser.uid;

// //   const typingRef = ref(rtdb, `typingStatus/${combinedId}/${currentUser.uid}`);

// //   const handleTyping = (e) => {
// //     setMessage(e.target.value);

// //     if (e.target.value !== "") {
// //       set(typingRef, true);
// //       clearTimeout(typingTimeout.current);
// //       typingTimeout.current = setTimeout(() => set(typingRef, false), 2000);
// //     } else {
// //       set(typingRef, false);
// //     }
// //   };

// //   const handleFileChange = (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     if (previewUrl) URL.revokeObjectURL(previewUrl);

// //     setSelectedFile(file);
// //     setPreviewUrl(URL.createObjectURL(file));

// //     e.target.value = null;
// //   };

// //   const handleRemovePreview = () => {
// //     if (previewUrl) URL.revokeObjectURL(previewUrl);
// //     setSelectedFile(null);
// //     setPreviewUrl(null);
// //   };

// //   const handleSendMessage = async (e) => {
// //     e.preventDefault();
// //     if (!message.trim() && !selectedFile) return;

// //     try {
// //       // Create or update chat document with participants
// //       const chatRef = doc(db, "chats", combinedId);
// //       await setDoc(
// //         chatRef,
// //         {
// //           participants: [currentUser.uid, selectedUser.uid],
// //           createdAt: serverTimestamp(),
// //         },
// //         { merge: true }
// //       );

// //       if (selectedFile) {
// //         const uploadResult = await uploadFileToCloudinary(
// //           selectedFile,
// //           combinedId
// //         );
// //         console.log("Cloudinary Upload Result:", uploadResult);

// //         await addDoc(collection(db, "chats", combinedId, "messages"), {
// //           text: message.trim() || null,
// //           fileUrl: uploadResult.secure_url,
// //           fileName: selectedFile.name,
// //           fileType: selectedFile.type,
// //           uid: currentUser.uid,
// //           displayName: currentUser.displayName,
// //           photoURL: currentUser.photoURL,
// //           createdAt: serverTimestamp(),
// //         });

// //         handleRemovePreview();
// //       } else {
// //         await addDoc(collection(db, "chats", combinedId, "messages"), {
// //           text: message.trim(),
// //           uid: currentUser.uid,
// //           displayName: currentUser.displayName,
// //           photoURL: currentUser.photoURL,
// //           createdAt: serverTimestamp(),
// //         });
// //       }

// //       setMessage("");
// //       set(typingRef, false);
// //     } catch (error) {
// //       console.error("Send message failed:", error);
// //     }
// //   };

// //   return (
// //     <>
// //       {previewUrl && (
// //         <div className="flex items-center p-2 bg-[#202c33] border-t border-gray-700">
// //           <img
// //             src={previewUrl}
// //             alt="Selected file preview"
// //             className="h-16 w-16 object-cover rounded-md"
// //           />
// //           <button
// //             type="button"
// //             onClick={handleRemovePreview}
// //             className="ml-3 text-gray-400 hover:text-white"
// //             title="Remove Image"
// //           >
// //             <X size={20} />
// //           </button>
// //         </div>
// //       )}

// //       <form
// //         onSubmit={handleSendMessage}
// //         className="flex items-center gap-3 px-4 py-3 bg-[#202c33] border-t border-gray-700"
// //       >
// //         <button
// //           type="button"
// //           onClick={() => fileInputRef.current.click()}
// //           className="text-gray-300 hover:text-white"
// //           title="Attach File"
// //         >
// //           <Paperclip size={20} />
// //         </button>

// //         <input
// //           type="file"
// //           ref={fileInputRef}
// //           className="hidden"
// //           onChange={handleFileChange}
// //           accept="image/*"
// //         />

// //         <input
// //           type="text"
// //           value={message}
// //           onChange={handleTyping}
// //           placeholder="Type a message"
// //           className="flex-grow px-4 py-2 bg-[#2a3942] text-white border border-[#2a3942] rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
// //         />

// //         <button
// //           type="submit"
// //           disabled={!message.trim() && !selectedFile}
// //           className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full disabled:opacity-50"
// //           title="Send Message"
// //         >
// //           <Send size={16} />
// //         </button>
// //       </form>
// //     </>
// //   );
// // };

// // export default MessageInput;
// import { useState, useRef, useEffect } from "react";
// import {
//   addDoc,
//   collection,
//   serverTimestamp,
//   doc,
//   setDoc,
// } from "firebase/firestore";
// import { ref, set } from "firebase/database";
// import { db, rtdb } from "../firebase/firebaseConfig";
// import { useAuth } from "../context/AuthContext";
// import { useChat } from "../context/ChatContext";
// import { Paperclip, Send, X } from "lucide-react";

// // Upload file to Cloudinary and return the response JSON
// const uploadFileToCloudinary = async (file, combinedId) => {
//   const formData = new FormData();
//   formData.append("upload_preset", "chat_uploads");
//   formData.append("folder", `chatFiles/${combinedId}`);
//   formData.append("file", file);

//   const response = await fetch(
//     "https://api.cloudinary.com/v1_1/dhvdjr4ie/upload",
//     {
//       method: "POST",
//       body: formData,
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Cloudinary upload failed");
//   }

//   return await response.json();
// };

// const MessageInput = () => {
//   const [message, setMessage] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const fileInputRef = useRef(null);
//   const typingTimeout = useRef(null);
//   const { currentUser } = useAuth();
//   const { selectedUser } = useChat();

//   // Cleanup preview URL & timeout on unmount or preview change
//   useEffect(() => {
//     return () => {
//       if (typingTimeout.current) clearTimeout(typingTimeout.current);
//       if (previewUrl) URL.revokeObjectURL(previewUrl);
//     };
//   }, [previewUrl]);

//   if (!selectedUser) {
//     return (
//       <div className="p-4 text-center text-gray-400 text-sm">
//         Select a user to start chatting
//       </div>
//     );
//   }

//   const combinedId =
//     currentUser.uid > selectedUser.uid
//       ? currentUser.uid + selectedUser.uid
//       : selectedUser.uid + currentUser.uid;

//   const typingRef = ref(rtdb, `typingStatus/${combinedId}/${currentUser.uid}`);

//   // Handle typing with debounce to set typing status in realtime DB
//   const handleTyping = (e) => {
//     setMessage(e.target.value);

//     if (e.target.value !== "") {
//       set(typingRef, true);
//       clearTimeout(typingTimeout.current);
//       typingTimeout.current = setTimeout(() => set(typingRef, false), 2000);
//     } else {
//       set(typingRef, false);
//     }
//   };

//   // When user selects a file, save it and generate preview URL
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (previewUrl) URL.revokeObjectURL(previewUrl);

//     setSelectedFile(file);
//     setPreviewUrl(URL.createObjectURL(file));

//     // reset input to allow selecting same file again
//     e.target.value = null;
//   };

//   // Remove selected file and preview
//   const handleRemovePreview = () => {
//     if (previewUrl) URL.revokeObjectURL(previewUrl);
//     setSelectedFile(null);
//     setPreviewUrl(null);
//   };

//   // Send message handler, handles text-only or with file upload
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!message.trim() && !selectedFile) return;

//     try {
//       // Ensure chat doc exists with participants
//       const chatRef = doc(db, "chats", combinedId);
//       await setDoc(
//         chatRef,
//         {
//           participants: [currentUser.uid, selectedUser.uid],
//           createdAt: serverTimestamp(),
//         },
//         { merge: true }
//       );

//       if (selectedFile) {
//         // Upload file to Cloudinary and get URL
//         const uploadResult = await uploadFileToCloudinary(
//           selectedFile,
//           combinedId
//         );

//         await addDoc(collection(db, "chats", combinedId, "messages"), {
//           text: message.trim() || null,
//           fileUrl: uploadResult.secure_url,
//           fileName: selectedFile.name,
//           fileType: selectedFile.type,
//           uid: currentUser.uid,
//           displayName: currentUser.displayName,
//           photoURL: currentUser.photoURL,
//           createdAt: serverTimestamp(),
//         });

//         handleRemovePreview();
//       } else {
//         // Text only message
//         await addDoc(collection(db, "chats", combinedId, "messages"), {
//           text: message.trim(),
//           uid: currentUser.uid,
//           displayName: currentUser.displayName,
//           photoURL: currentUser.photoURL,
//           createdAt: serverTimestamp(),
//         });
//       }

//       setMessage("");
//       set(typingRef, false);
//     } catch (error) {
//       console.error("Send message failed:", error);
//     }
//   };

//   return (
//     <>
//       {/* Preview selected image */}
//       {previewUrl && (
//         <div className="flex items-center p-2 bg-[#202c33] border-t border-gray-700">
//           <img
//             src={previewUrl}
//             alt="Selected file preview"
//             className="h-16 w-16 object-cover rounded-md"
//           />
//           <button
//             type="button"
//             onClick={handleRemovePreview}
//             className="ml-3 text-gray-400 hover:text-white"
//             title="Remove Image"
//           >
//             <X size={20} />
//           </button>
//         </div>
//       )}

//       <form
//         onSubmit={handleSendMessage}
//         className="flex items-center gap-3 px-4 py-3 bg-[#202c33] border-t border-gray-700"
//       >
//         {/* File attach button */}
//         <button
//           type="button"
//           onClick={() => fileInputRef.current.click()}
//           className="text-gray-300 hover:text-white"
//           title="Attach File"
//         >
//           <Paperclip size={20} />
//         </button>

//         {/* Hidden file input */}
//         <input
//           type="file"
//           ref={fileInputRef}
//           className="hidden"
//           onChange={handleFileChange}
//           accept="image/*"
//         />

//         {/* Text input */}
//         <input
//           type="text"
//           value={message}
//           onChange={handleTyping}
//           placeholder="Type a message"
//           className="flex-grow px-4 py-2 bg-[#2a3942] text-white border border-[#2a3942] rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
//         />

//         {/* Send button */}
//         <button
//           type="submit"
//           disabled={!message.trim() && !selectedFile}
//           className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full disabled:opacity-50"
//           title="Send Message"
//         >
//           <Send size={16} />
//         </button>
//       </form>
//     </>
//   );
// };

// export default MessageInput;

// // import { useState, useRef, useEffect } from "react";
// // import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// // import { ref, set } from "firebase/database";
// // import { db, rtdb } from "../firebase/firebaseConfig";
// // import { useAuth } from "../context/AuthContext";
// // import { useChat } from "../context/ChatContext";

// // import { Paperclip, Send, X } from "lucide-react"; // added X icon for remove
// // import { v4 as uuidv4 } from "uuid";

// // const uploadFileToCloudinary = async (file, combinedId) => {
// //   const formData = new FormData();

// //   formData.append("upload_preset", "chat_uploads");
// //   formData.append("folder", `chatFiles/${combinedId}`);
// //   formData.append("file", file);

// //   const response = await fetch(
// //     "https://api.cloudinary.com/v1_1/dhvdjr4ie/upload",
// //     {
// //       method: "POST",
// //       body: formData,
// //     }
// //   );

// //   if (!response.ok) {
// //     throw new Error("Cloudinary upload failed");
// //   }

// //   return await response.json();
// // };

// // const MessageInput = () => {
// //   const [message, setMessage] = useState("");
// //   const [selectedFile, setSelectedFile] = useState(null); // to hold the image file
// //   const [previewUrl, setPreviewUrl] = useState(null); // to hold preview URL
// //   const fileInputRef = useRef(null);
// //   const typingTimeout = useRef(null);
// //   const { currentUser } = useAuth();
// //   const { selectedUser } = useChat();

// //   useEffect(() => {
// //     return () => {
// //       if (typingTimeout.current) clearTimeout(typingTimeout.current);
// //       // Clean up preview URL object when component unmounts or selectedFile changes
// //       if (previewUrl) URL.revokeObjectURL(previewUrl);
// //     };
// //   }, [previewUrl]);

// //   if (!selectedUser) {
// //     return (
// //       <div className="p-4 text-center text-gray-400 text-sm">
// //         Select a user to start chatting
// //       </div>
// //     );
// //   }

// //   const combinedId =
// //     currentUser.uid > selectedUser.uid
// //       ? currentUser.uid + selectedUser.uid
// //       : selectedUser.uid + currentUser.uid;

// //   const typingRef = ref(rtdb, `typingStatus/${combinedId}/${currentUser.uid}`);

// //   const handleTyping = (e) => {
// //     setMessage(e.target.value);

// //     if (e.target.value !== "") {
// //       set(typingRef, true);
// //       clearTimeout(typingTimeout.current);
// //       typingTimeout.current = setTimeout(() => set(typingRef, false), 2000);
// //     } else {
// //       set(typingRef, false);
// //     }
// //   };

// //   // When user picks a file, create a preview and hold file in state
// //   const handleFileChange = (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     // Clean up old preview URL if any
// //     if (previewUrl) URL.revokeObjectURL(previewUrl);

// //     setSelectedFile(file);
// //     setPreviewUrl(URL.createObjectURL(file));

// //     // Clear the file input to allow selecting same file again if needed
// //     e.target.value = null;
// //   };

// //   // Remove the selected image preview and reset file
// //   const handleRemovePreview = () => {
// //     if (previewUrl) URL.revokeObjectURL(previewUrl);
// //     setSelectedFile(null);
// //     setPreviewUrl(null);
// //   };

// //   const handleSendMessage = async (e) => {
// //     e.preventDefault();
// //     if (!message.trim() && !selectedFile) return; // do nothing if no message or file

// //     try {
// //       if (selectedFile) {
// //         // Upload file to Cloudinary
// //         const uploadResult = await uploadFileToCloudinary(
// //           selectedFile,
// //           combinedId
// //         );

// //         // Send message with file info + text if exists
// //         await addDoc(collection(db, "chats", combinedId, "messages"), {
// //           text: message.trim() || null,
// //           fileUrl: uploadResult.secure_url,
// //           fileName: selectedFile.name,
// //           fileType: selectedFile.type,
// //           uid: currentUser.uid,
// //           displayName: currentUser.displayName,
// //           photoURL: currentUser.photoURL,
// //           createdAt: serverTimestamp(),
// //         });

// //         // Clear selected file and preview after sending
// //         handleRemovePreview();
// //       } else {
// //         // Send text only message
// //         await addDoc(collection(db, "chats", combinedId, "messages"), {
// //           text: message.trim(),
// //           uid: currentUser.uid,
// //           displayName: currentUser.displayName,
// //           photoURL: currentUser.photoURL,
// //           createdAt: serverTimestamp(),
// //         });
// //       }

// //       setMessage("");
// //       set(typingRef, false);
// //     } catch (error) {
// //       console.error("Send message failed:", error);
// //     }
// //   };

// //   return (
// //     <>
// //       {/* Preview Section */}
// //       {previewUrl && (
// //         <div className="flex items-center p-2 bg-[#202c33] border-t border-gray-700">
// //           <img
// //             src={previewUrl}
// //             alt="Selected file preview"
// //             className="h-16 w-16 object-cover rounded-md"
// //           />
// //           <button
// //             type="button"
// //             onClick={handleRemovePreview}
// //             className="ml-3 text-gray-400 hover:text-white"
// //             title="Remove Image"
// //           >
// //             <X size={20} />
// //           </button>
// //         </div>
// //       )}

// //       <form
// //         onSubmit={handleSendMessage}
// //         className="flex items-center gap-3 px-4 py-3 bg-[#202c33] border-t border-gray-700"
// //       >
// //         {/* Attachment Icon */}
// //         <button
// //           type="button"
// //           onClick={() => fileInputRef.current.click()}
// //           className="text-gray-300 hover:text-white"
// //           title="Attach File"
// //         >
// //           <Paperclip size={20} />
// //         </button>

// //         <input
// //           type="file"
// //           ref={fileInputRef}
// //           className="hidden"
// //           onChange={handleFileChange}
// //           accept="image/*"
// //         />

// //         {/* Message Input */}
// //         <input
// //           type="text"
// //           value={message}
// //           onChange={handleTyping}
// //           placeholder="Type a message"
// //           className="flex-grow px-4 py-2 bg-[#2a3942] text-white border border-[#2a3942] rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
// //         />

// //         {/* Send Button */}
// //         <button
// //           type="submit"
// //           disabled={!message.trim() && !selectedFile}
// //           className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full disabled:opacity-50"
// //           title="Send Message"
// //         >
// //           <Send size={16} />
// //         </button>
// //       </form>
// //     </>
// //   );
// // };

// // export default MessageInput;

// import { useState, useRef, useEffect } from "react";
// import {
//   addDoc,
//   collection,
//   serverTimestamp,
//   doc,
//   setDoc,
// } from "firebase/firestore";
// import { ref, set } from "firebase/database";
// import { db, rtdb } from "../firebase/firebaseConfig";
// import { useAuth } from "../context/AuthContext";
// import { useChat } from "../context/ChatContext";
// import { Paperclip, Send, X } from "lucide-react";
// import { v4 as uuidv4 } from "uuid";

// const uploadFileToCloudinary = async (file, combinedId) => {
//   const formData = new FormData();
//   formData.append("upload_preset", "chat_uploads");
//   formData.append("folder", `chatFiles/${combinedId}`);
//   formData.append("file", file);

//   const response = await fetch(
//     "https://api.cloudinary.com/v1_1/dhvdjr4ie/upload",
//     {
//       method: "POST",
//       body: formData,
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Cloudinary upload failed");
//   }

//   return await response.json();
// };

// const MessageInput = () => {
//   const [message, setMessage] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const fileInputRef = useRef(null);
//   const typingTimeout = useRef(null);
//   const { currentUser } = useAuth();
//   const { selectedUser } = useChat();

//   useEffect(() => {
//     return () => {
//       if (typingTimeout.current) clearTimeout(typingTimeout.current);
//       if (previewUrl) URL.revokeObjectURL(previewUrl);
//     };
//   }, [previewUrl]);

//   if (!selectedUser) {
//     return (
//       <div className="p-4 text-center text-gray-400 text-sm">
//         Select a user to start chatting
//       </div>
//     );
//   }

//   const combinedId =
//     currentUser.uid > selectedUser.uid
//       ? currentUser.uid + selectedUser.uid
//       : selectedUser.uid + currentUser.uid;

//   const typingRef = ref(rtdb, `typingStatus/${combinedId}/${currentUser.uid}`);

//   const handleTyping = (e) => {
//     setMessage(e.target.value);

//     if (e.target.value !== "") {
//       set(typingRef, true);
//       clearTimeout(typingTimeout.current);
//       typingTimeout.current = setTimeout(() => set(typingRef, false), 2000);
//     } else {
//       set(typingRef, false);
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (previewUrl) URL.revokeObjectURL(previewUrl);

//     setSelectedFile(file);
//     setPreviewUrl(URL.createObjectURL(file));

//     e.target.value = null;
//   };

//   const handleRemovePreview = () => {
//     if (previewUrl) URL.revokeObjectURL(previewUrl);
//     setSelectedFile(null);
//     setPreviewUrl(null);
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!message.trim() && !selectedFile) return;

//     try {
//       // Create or update chat document with participants
//       const chatRef = doc(db, "chats", combinedId);
//       await setDoc(
//         chatRef,
//         {
//           participants: [currentUser.uid, selectedUser.uid],
//           createdAt: serverTimestamp(),
//         },
//         { merge: true }
//       );

//       if (selectedFile) {
//         const uploadResult = await uploadFileToCloudinary(
//           selectedFile,
//           combinedId
//         );
//         console.log("Cloudinary Upload Result:", uploadResult);

//         await addDoc(collection(db, "chats", combinedId, "messages"), {
//           text: message.trim() || null,
//           fileUrl: uploadResult.secure_url,
//           fileName: selectedFile.name,
//           fileType: selectedFile.type,
//           uid: currentUser.uid,
//           displayName: currentUser.displayName,
//           photoURL: currentUser.photoURL,
//           createdAt: serverTimestamp(),
//         });

//         handleRemovePreview();
//       } else {
//         await addDoc(collection(db, "chats", combinedId, "messages"), {
//           text: message.trim(),
//           uid: currentUser.uid,
//           displayName: currentUser.displayName,
//           photoURL: currentUser.photoURL,
//           createdAt: serverTimestamp(),
//         });
//       }

//       setMessage("");
//       set(typingRef, false);
//     } catch (error) {
//       console.error("Send message failed:", error);
//     }
//   };

//   return (
//     <>
//       {previewUrl && (
//         <div className="flex items-center p-2 bg-[#202c33] border-t border-gray-700">
//           <img
//             src={previewUrl}
//             alt="Selected file preview"
//             className="h-16 w-16 object-cover rounded-md"
//           />
//           <button
//             type="button"
//             onClick={handleRemovePreview}
//             className="ml-3 text-gray-400 hover:text-white"
//             title="Remove Image"
//           >
//             <X size={20} />
//           </button>
//         </div>
//       )}

//       <form
//         onSubmit={handleSendMessage}
//         className="flex items-center gap-3 px-4 py-3 bg-[#202c33] border-t border-gray-700"
//       >
//         <button
//           type="button"
//           onClick={() => fileInputRef.current.click()}
//           className="text-gray-300 hover:text-white"
//           title="Attach File"
//         >
//           <Paperclip size={20} />
//         </button>

//         <input
//           type="file"
//           ref={fileInputRef}
//           className="hidden"
//           onChange={handleFileChange}
//           accept="image/*"
//         />

//         <input
//           type="text"
//           value={message}
//           onChange={handleTyping}
//           placeholder="Type a message"
//           className="flex-grow px-4 py-2 bg-[#2a3942] text-white border border-[#2a3942] rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
//         />

//         <button
//           type="submit"
//           disabled={!message.trim() && !selectedFile}
//           className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full disabled:opacity-50"
//           title="Send Message"
//         >
//           <Send size={16} />
//         </button>
//       </form>
//     </>
//   );
// };

// export default MessageInput;
import { useState, useRef, useEffect } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { ref, set } from "firebase/database";
import { db, rtdb } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { Paperclip, Send, X } from "lucide-react";

// Upload file to Cloudinary and return the response JSON
const uploadFileToCloudinary = async (file, combinedId) => {
  const formData = new FormData();
  formData.append("upload_preset", "chat_uploads");
  formData.append("folder", `chatFiles/${combinedId}`);
  formData.append("file", file);

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dhvdjr4ie/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Cloudinary upload failed");
  }

  return await response.json();
};

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const typingTimeout = useRef(null);
  const { currentUser } = useAuth();
  const { selectedUser } = useChat();

  // Cleanup preview URL & timeout on unmount or preview change
  useEffect(() => {
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!selectedUser) {
    return (
      <div className="p-4 text-center text-gray-400 text-sm">
        Select a user to start chatting
      </div>
    );
  }

  const combinedId =
    currentUser.uid > selectedUser.uid
      ? currentUser.uid + selectedUser.uid
      : selectedUser.uid + currentUser.uid;

  const typingRef = ref(rtdb, `typingStatus/${combinedId}/${currentUser.uid}`);
  // Handle typing with debounce to set typing status in realtime DB
  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (e.target.value !== "") {
      set(typingRef, true);
      typingTimeout.current = setTimeout(() => {
        channel.trigger("client-typing-stop", { userId: currentUser.uid });
      }, 2000); // Adjust the timeout as needed
    } else {
      set(typingRef, false);
      channel.trigger("client-typing-stop", { userId: currentUser.uid });
    }
  };

  // When user selects a file, save it and generate preview URL
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    // reset input to allow selecting same file again
    e.target.value = null;
  };

  // Remove selected file and preview
  const handleRemovePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  // Send message handler, handles text-only or with file upload
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && !selectedFile) return;

    try {
      // Ensure chat doc exists with participants
      const chatRef = doc(db, "chats", combinedId);
      await setDoc(
        chatRef,
        {
          participants: [currentUser.uid, selectedUser.uid],
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      if (selectedFile) {
        // Upload file to Cloudinary and get URL
        const uploadResult = await uploadFileToCloudinary(
          selectedFile,
          combinedId
        );

        await addDoc(collection(db, "chats", combinedId, "messages"), {
          text: message.trim() || null,
          fileUrl: uploadResult.secure_url,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          createdAt: serverTimestamp(),
        });

        // Update last message in 'lastMessages' collection
        const lastMessageRef = doc(db, "lastMessages", combinedId);
        await setDoc(
          lastMessageRef,
          {
            text: message.trim() || null,
            fileUrl: uploadResult.secure_url,
            fileType: selectedFile.type,
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );

        handleRemovePreview();
      } else {
        // Text only message
        const newMessageRef = await addDoc(
          collection(db, "chats", combinedId, "messages"),
          {
            text: message.trim(),
            // Add other fields if needed for last message display (e.g., sender, timestamp)
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            createdAt: serverTimestamp(),
          }
        );
      }

      // Update last message in 'lastMessages' collection for text messages
      const lastMessageRef = doc(db, "lastMessages", combinedId);
      await setDoc(
        lastMessageRef,
        {
          text: message.trim(),
          createdAt: serverTimestamp(), // Include timestamp
        },
        { merge: true }
      );
      setMessage("");
      set(typingRef, false);
    } catch (error) {
      console.error("Send message failed:", error);
    }
  };

  return (
    <>
      {/* Preview selected image */}
      {previewUrl && (
        <div className="flex items-center p-2 bg-[#202c33] border-t border-gray-700">
          <img
            src={previewUrl}
            alt="Selected file preview"
            className="h-16 w-16 object-cover rounded-md"
          />
          <button
            type="button"
            onClick={handleRemovePreview}
            className="ml-3 text-gray-400 hover:text-white"
            title="Remove Image"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-3 px-4 py-3 bg-[#202c33] border-t border-gray-700"
      >
        {/* File attach button */}
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="text-gray-300 hover:text-white"
          title="Attach File"
        >
          <Paperclip size={20} />
        </button>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />

        {/* Text input */}
        <input
          type="text"
          value={message}
          onChange={handleTyping}
          placeholder="Type a message"
          className="flex-grow px-4 py-2 bg-[#2a3942] text-white border border-[#2a3942] rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!message.trim() && !selectedFile}
          className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full disabled:opacity-50"
          title="Send Message"
        >
          <Send size={16} />
        </button>
      </form>
    </>
  );
};

export default MessageInput;
