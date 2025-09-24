import React, { useEffect, useState } from "react";
import { FaPencilAlt, FaCheck } from "react-icons/fa";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

const ProfilePopup = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [aboutInput, setAboutInput] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const userRef = doc(db, "users", currentUser.uid);
    const unsub = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        setNameInput(data.displayName || "");
        setAboutInput(data.about || "");
      }
    });

    return () => unsub();
  }, [currentUser.uid]);

  const handleSave = async () => {
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        displayName: nameInput,
        about: aboutInput,
      });
      setEditingField(null);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!userData) return null;

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full 
              w-full sm:w-[300px] md:w-[350px] lg:w-[400px] xl:w-[420px]
              bg-[#1f2c33] z-20 shadow-lg text-white 
              overflow-y-auto transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col items-center p-6 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-xl hover:text-gray-400"
          >
            ✕
          </button>

          {/* Profile Image */}
          <img
            src={userData.photoURL || "/default-avatar.png"}
            alt="Profile"
            className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full object-cover border-4 border-green-500"
          />

          {/* Name Field */}
          <div className="w-full mt-6 px-4">
            <label className="text-green-400 text-sm sm:text-base mb-1 block">
              Your Name
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                disabled={editingField !== "name"}
                className={`w-full text-base sm:text-lg md:text-xl bg-transparent border-b ${
                  editingField === "name"
                    ? "border-[#00a884]"
                    : "border-gray-600"
                } text-white outline-none py-1`}
              />
              {editingField === "name" ? (
                <FaCheck
                  className="text-green-500 cursor-pointer"
                  onClick={handleSave}
                />
              ) : (
                <FaPencilAlt
                  className="text-gray-400 cursor-pointer"
                  onClick={() => setEditingField("name")}
                />
              )}
            </div>
          </div>

          {/* About Field */}
          <div className="w-full mt-6 px-4">
            <label className="text-green-400 text-sm sm:text-base mb-1 block">
              About
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={aboutInput}
                onChange={(e) => setAboutInput(e.target.value)}
                disabled={editingField !== "about"}
                className={`w-full text-base sm:text-lg md:text-xl bg-transparent border-b ${
                  editingField === "about"
                    ? "border-[#00a884]"
                    : "border-gray-600"
                } text-white outline-none py-1`}
              />
              {editingField === "about" ? (
                <FaCheck
                  className="text-green-500 cursor-pointer"
                  onClick={handleSave}
                />
              ) : (
                <FaPencilAlt
                  className="text-gray-400 cursor-pointer"
                  onClick={() => setEditingField("about")}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePopup;
