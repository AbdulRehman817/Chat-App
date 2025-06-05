// // src/components/ChatHeader.js
// import { useAuth } from "../context/AuthContext";
// import { useChat } from "../context/ChatContext";
// import { LogOut } from "lucide-react";
// import { useEffect, useState } from "react";
// import { doc, getDoc } from "firebase/firestore";
// import { db, rtdb } from "../firebase/firebaseConfig";
// import { ref as dbRef, onValue } from "firebase/database";
// import { useNavigate } from "react-router-dom";

// const ChatHeader = () => {
//   const { logout } = useAuth();
//   const { selectedUser } = useChat();
//   const [userData, setUserData] = useState(null);
//   const [isOnline, setIsOnline] = useState(false);
//   const [lastSeen, setLastSeen] = useState(null);
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await logout();
//     navigate("/login");
//   };

//   useEffect(() => {
//     if (!selectedUser) return;

//     const fetchUserData = async () => {
//       const userDocRef = doc(db, "users", selectedUser.uid);
//       const docSnap = await getDoc(userDocRef);

//       if (docSnap.exists()) {
//         setUserData(docSnap.data());
//       }
//     };

//     fetchUserData();
//   }, [selectedUser]);

//   useEffect(() => {
//     if (!selectedUser) return;

//     const statusRef = dbRef(rtdb, `/status/${selectedUser.uid}`);
//     const unsubscribe = onValue(statusRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         setIsOnline(data.state === "online");
//         setLastSeen(data.lastChanged);
//       } else {
//         setIsOnline(false);
//         setLastSeen(null);
//       }
//     });

//     return () => unsubscribe();
//   }, [selectedUser]);

//   const formatLastSeen = (timestamp) => {
//     if (!timestamp) return null;
//     const date = new Date(
//       typeof timestamp === "number" ? timestamp : timestamp.toMillis()
//     );
//     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   };

//   if (!userData) return null;

//   return (
//     <div className="flex items-center justify-between px-4 py-3 border-b bg-[#202c33] shadow-sm">
//       <div className="flex items-center gap-3">
//         <img
//           src={userData.photoURL || "/default-avatar.png"}
//           alt="Profile"
//           className="w-12 h-12 rounded-full object-cover"
//         />
//         <div>
//           <h2 className="text-[20px] font-semibold text-white">
//             {userData.displayName}
//           </h2>
//           {isOnline ? (
//             <p className="text-xs text-green-500">● Online</p>
//           ) : (
//             <p className="text-xs text-gray-400">
//               ● Offline{" "}
//               {lastSeen ? ` - Last seen: ${formatLastSeen(lastSeen)}` : ""}
//             </p>
//           )}
//         </div>
//       </div>

//       <button onClick={handleLogout} title="Logout">
//         <LogOut className="text-gray-500 hover:text-red-500 w-5 h-5" />
//       </button>
//     </div>
//   );
// };

// export default ChatHeader;

import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, rtdb } from "../firebase/firebaseConfig";
import { ref as dbRef, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";

const ChatHeader = () => {
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
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-b bg-[#202c33] shadow-sm w-full gap-2 sm:gap-0">
      {/* Left Section */}
      <div className="flex items-center gap-3 text-center sm:text-left">
        <img
          src={userData.photoURL || "/default-avatar.png"}
          alt="Profile"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
        />
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-white">
            {userData.displayName}
          </h2>
          {isOnline ? (
            <p className="text-xs text-green-500">● Online</p>
          ) : (
            <p className="text-xs text-gray-400">
              ● Offline{" "}
              {lastSeen ? ` - Last seen: ${formatLastSeen(lastSeen)}` : ""}
            </p>
          )}
        </div>
      </div>

      {/* Right Section - Logout */}
      <button
        onClick={handleLogout}
        title="Logout"
        className="self-center sm:self-auto"
      >
        <LogOut className="text-gray-400 hover:text-red-500 w-5 h-5 transition" />
      </button>
    </div>
  );
};

export default ChatHeader;
