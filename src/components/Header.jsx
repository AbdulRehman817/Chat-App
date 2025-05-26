import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { LogOut } from "lucide-react";

const ChatHeader = () => {
  const { currentUser, logout } = useAuth();
  const { selectedUser } = useChat();
  console.log("online user:", selectedUser.online);

  if (!selectedUser) return null; // hide header if no user selected

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-white shadow-sm">
      {/* Left: selected user info */}
      <div className="flex items-center gap-3">
        <img
          src={selectedUser.photoURL}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h2 className="text-sm font-semibold text-gray-800">
            {selectedUser.displayName}
          </h2>
          <p
            className={`text-xs ${
              selectedUser.online ? "text-green-500" : "text-gray-400"
            }`}
          >
            ● {selectedUser.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Right: logout button */}
      <button onClick={logout} title="Logout">
        <LogOut className="text-gray-500 hover:text-red-500 w-5 h-5" />
      </button>
    </div>
  );
};

export default ChatHeader;
