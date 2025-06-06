import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { LogOut, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, rtdb } from "../firebase/firebaseConfig";
import { ref as dbRef, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";

const ChatHeader = ({ showBackButton = false, onBack }) => {
  const { logout } = useAuth();
  const { selectedUser } = useChat();
  const [userData, setUserData] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    if (!selectedUser) return;

    const fetchUserData = async () => {
      const userDocRef = doc(db, "users", selectedUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    };

    fetchUserData();
  }, [selectedUser]);

  useEffect(() => {
    if (!selectedUser) return;

    const statusRef = dbRef(rtdb, `/status/${selectedUser.uid}`);
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setIsOnline(data.state === "online");
        setLastSeen(data.lastChanged);
      } else {
        setIsOnline(false);
        setLastSeen(null);
      }
    });

    return () => unsubscribe();
  }, [selectedUser]);

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(
      typeof timestamp === "number" ? timestamp : timestamp.toMillis()
    );
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!userData) return null;

  return (
    <div className="flex items-center justify-between px-3 py-2 border-b bg-[#202c33] shadow-sm w-full">
      {/* Left: Back button + Avatar + Name */}
      <div className="flex items-center gap-3 overflow-hidden w-[85%] sm:w-auto">
        {showBackButton && (
          <button
            onClick={onBack}
            className="sm:hidden md:hidden text-white p-1 rounded hover:bg-[#2a3942] transition"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <img
          src={userData.photoURL || "/default-avatar.png"}
          alt="Profile"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
        />

        <div className="flex flex-col overflow-hidden">
          <h2 className="text-white font-semibold text-sm sm:text-base truncate">
            {userData.displayName}
          </h2>
          {isOnline ? (
            <p className="text-xs text-green-500 truncate">● Online</p>
          ) : (
            <p className="text-xs text-gray-400 truncate">
              ● Offline{" "}
              {lastSeen ? ` - Last seen: ${formatLastSeen(lastSeen)}` : ""}
            </p>
          )}
        </div>
      </div>

      {/* Right: Logout */}
      <button
        onClick={handleLogout}
        title="Logout"
        className="text-gray-400 hover:text-red-500 transition sm:ml-4"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ChatHeader;
