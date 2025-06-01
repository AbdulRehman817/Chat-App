// import { useAuth } from "../context/AuthContext";
// import { useChat } from "../context/ChatContext";
// import { LogOut, UserCheck } from "lucide-react";

// const ChatHeader = ({ user }) => {
//   const { currentUser, logout } = useAuth();
//   const { selectedUser } = useChat();
//   console.log("online user:", user.online);

//   if (!UserCheck) return null; // hide header if no user selected

//   return (
//     <div className="flex items-center justify-between px-4 py-3 border-b bg-white shadow-sm">
//       {/* Left: selected user info */}
//       <div className="flex items-center gap-3">
//         <img
//           src={user.photoURL}
//           alt="Profile"
//           className="w-10 h-10 rounded-full object-cover"
//         />
//         <div>
//           <h2 className="text-sm font-semibold text-gray-800">
//             {user.displayName}
//           </h2>
//           <p
//             className={`text-xs ${
//               user.online ? "text-green-500" : "text-gray-400"
//             }`}
//           >
//             ● {user.online ? "Online" : "Offline"}
//           </p>
//         </div>
//       </div>

//       {/* Right: logout button */}
//       <button onClick={logout} title="Logout">
//         <LogOut className="text-gray-500 hover:text-red-500 w-5 h-5" />
//       </button>
//     </div>
//   );
// };

// export default ChatHeader;
// components/ChatHeader.jsx
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const ChatHeader = () => {
  const { currentUser, logout } = useAuth();
  const { selectedUser } = useChat();
  const [userData, setUserData] = useState(null);

  // Realtime listener for selectedUser
  useEffect(() => {
    if (!selectedUser) return;

    const unsub = onSnapshot(doc(db, "users", selectedUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    });

    return () => unsub();
  }, [selectedUser]);

  if (!userData) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-[#202c33] shadow-sm">
      {/* Left: selected user info */}
      <div className="flex items-center gap-3">
        <img
          src={userData.photoURL || "/default-avatar.png"}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h2 className="text-[20px] font-semibold text-white">
            {userData.displayName}
          </h2>
          <p
            className={`text-xs ${
              userData.online ? "text-green-500" : "text-gray-400"
            }`}
          >
            ● {userData.online ? "Online" : "Offline"}
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
