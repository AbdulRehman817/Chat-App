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
    setMessage(e.target.value);

    if (e.target.value !== "") {
      set(typingRef, true);
      typingTimeout.current = setTimeout(() => {
        // Trigger typing stop after timeout (optional real-time logic)
        set(typingRef, false);
      }, 2000);
    } else {
      set(typingRef, false);
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

      if (selectedFile) {
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

        await setDoc(
          doc(db, "lastMessages", combinedId),
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
        await addDoc(collection(db, "chats", combinedId, "messages"), {
          text: message.trim(),
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          createdAt: serverTimestamp(),
        });

        await setDoc(
          doc(db, "lastMessages", combinedId),
          {
            text: message.trim(),
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      setMessage("");
      set(typingRef, false);
    } catch (error) {
      console.error("Send message failed:", error);
    }
  };

  return (
    <>
      {/* Preview */}
      {previewUrl && (
        <div className="flex items-center p-2 bg-[#202c33] border-t border-gray-700">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-16 w-16 object-cover rounded-md"
          />
          <button
            type="button"
            onClick={handleRemovePreview}
            className="ml-3 text-gray-400 hover:text-white"
            title="Remove"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 bg-[#202c33] border-t border-gray-700 w-full"
      >
        {/* Attachment Button */}
        <div className="flex justify-between sm:justify-start items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="relative left-0 sm:left-0   text-gray-300 hover:text-white z-10"
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

        {/* Message Input */}
        <div className="flex w-full gap-2">
          <input
            type="text"
            value={message}
            onChange={handleTyping}
            placeholder="Type a message"
            className="w-full py-2 pl-8 pr-12 bg-[#2a3942] text-white rounded-full border border-[#2a3942] focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400 text-sm"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() && !selectedFile}
            className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full disabled:opacity-50"
            title="Send Message"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </>
  );
};

export default MessageInput;
