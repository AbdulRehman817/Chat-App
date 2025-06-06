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

  if (!response.ok) throw new Error("Cloudinary upload failed");
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

  const handleTyping = (e) => {
    const value = e.target.value;
    setMessage(value);

    if (value.trim()) {
      set(typingRef, true);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => set(typingRef, false), 2000);
    } else {
      set(typingRef, false);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    e.target.value = null;
  };

  const handleRemovePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && !selectedFile) return;

    try {
      const chatRef = doc(db, "chats", combinedId);
      await setDoc(
        chatRef,
        {
          participants: [currentUser.uid, selectedUser.uid],
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      const messageData = {
        text: message.trim() || null,
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        createdAt: serverTimestamp(),
      };

      if (selectedFile) {
        const uploadResult = await uploadFileToCloudinary(
          selectedFile,
          combinedId
        );

        messageData.fileUrl = uploadResult.secure_url;
        messageData.fileName = selectedFile.name;
        messageData.fileType = selectedFile.type;
      }

      await addDoc(
        collection(db, "chats", combinedId, "messages"),
        messageData
      );

      await setDoc(
        doc(db, "lastMessages", combinedId),
        {
          text: message.trim() || null,
          fileUrl: messageData.fileUrl || null,
          fileType: messageData.fileType || null,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      setMessage("");
      setSelectedFile(null);
      setPreviewUrl(null);
      set(typingRef, false);
    } catch (error) {
      console.error("Send message failed:", error);
    }
  };

  return (
    <>
      {/* File Preview */}
      {previewUrl && (
        <div className="flex items-center p-2 bg-[#202c33] border-t border-gray-700">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-16 w-16 object-cover rounded-md"
          />
          <div className="ml-3 text-white text-sm truncate">
            {selectedFile?.name}
          </div>
          <button
            onClick={handleRemovePreview}
            className="ml-auto text-gray-400 hover:text-white"
            title="Remove"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Message Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 bg-[#202c33] border-t border-gray-700 w-full"
      >
        {/* Attachment */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="text-gray-300 hover:text-white relative top-[39px] right-[12px] sm:top-0 sm:right-0  
            md:top-0 md:right-0

            lg:top-0 lg:right-0
            "
            title="Attach File"
          >
            <Paperclip size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        {/* Input + Send */}
        <div className="flex w-full gap-2">
          <input
            type="text"
            value={message}
            onChange={handleTyping}
            placeholder="Type a message"
            className=" relative left-4 py-2 pl-4 pr-10 bg-[#2a3942] text-white rounded-full border focus:outline-none placeholder:text-gray-400 text-sm   w-full 
    sm:py-2 sm:pl-4 sm:pr-10 
    sm:relative 
    sm:left-0
    sm:bg-[#2a3942] 
    sm:text-white 
    sm:rounded-full 
    sm:border 
    sm:focus:outline-none 
    sm:placeholder:text-gray-400 
    sm:text-sm

    md:py-2 md:pl-4 md:pr-10 
    md:bg-[#2a3942] 
    md:text-white 
    md:rounded-full 
    md:border 
    md:focus:outline-none 
    md:placeholder:text-gray-400 
    md:text-sm
    lg:py-2 lg:pl-4 lg:pr-10 
    lg:bg-[#2a3942] 
    lg:text-white 
    lg:rounded-full 
    lg:border 
    lg:focus:outline-none 
    lg:placeholder:text-gray-400 
    lg:text-sm"
          />

          <button
            type="submit"
            disabled={!message.trim() && !selectedFile}
            className="relative text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full disabled:opacity-50 left-3.5 sm:left-0 sm:top-0 sm:relative sm:text-white sm:bg-green-500 sm:hover:bg-green-600 sm:px-4 sm:py-2 sm:rounded-full sm:disabled:opacity-50  
            
            
            
            md:left-0 md:top-0 md:relative md:text-white md:bg-green-500 md:hover:bg-green-600 md:px-4 md:py-2 md:rounded-full md:disabled:opacity-50


            lg:left-0 lg:top-0 lg:relative lg:text-white lg:bg-green-500 lg:hover:bg-green-600 lg:px-4 lg:py-2 lg:rounded-full lg:disabled:opacity-50
            "
            title="Send"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </>
  );
};

export default MessageInput;
