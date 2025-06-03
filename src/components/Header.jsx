// import { useAuth } from "../context/AuthContext";
// import { useChat } from "../context/ChatContext";
// import { LogOut } from "lucide-react";
// import { useEffect, useState } from "react";
// import { doc, onSnapshot } from "firebase/firestore";
// import { db } from "../firebase/firebaseConfig";
// import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

// const ChatHeader = () => {
//   const { logout } = useAuth();
//   const { selectedUser } = useChat();
//   const [userData, setUserData] = useState(null);
//   const navigate = useNavigate(); // ✅ Initialize navigate

//   const handleLogout = async () => {
//     await logout(); // logout from Firebase
//     navigate("/login"); // ✅ redirect to login
//     console.log("logout");
//   };

//   // Realtime listener for selected user
//   useEffect(() => {
//     if (!selectedUser) return;

//     const unsub = onSnapshot(doc(db, "users", selectedUser.uid), (docSnap) => {
//       if (docSnap.exists()) {
//         setUserData(docSnap.data());
//       }
//     });

//     return () => unsub();
//   }, [selectedUser]);

//   if (!userData) return null;

//   return (
//     <div className="flex items-center justify-between px-4 py-3 border-b bg-[#202c33] shadow-sm">
//       {/* Left: selected user info */}
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
//           <p
//             className={`text-xs ${
//               userData.online ? "text-green-500" : "text-gray-400"
//             }`}
//           >
//             ● {userData.online ? "Online" : "Offline"}
//           </p>
//         </div>
//       </div>

//       {/* Right: logout button */}
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
import { db, rtdb } from "../firebase/firebaseConfig"; // ✅ Make sure rtdb is exported
import { ref as dbRef, onValue } from "firebase/database"; // ✅ from Realtime DB
import { useNavigate } from "react-router-dom";

const ChatHeader = () => {
  const { logout } = useAuth();
  const { selectedUser } = useChat();
  const [userData, setUserData] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    console.log("logout");
  };

  // Get selected user info from Firestore
  useEffect(() => {
    const getUserData = async () => {
      if (!selectedUser) return;

      const userDocRef = doc(db, "users", selectedUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    };

    getUserData();
  }, [selectedUser]);

  // Get selected user online/offline status from Realtime DB
  useEffect(() => {
    if (!selectedUser) return;

    const statusRef = dbRef(rtdb, `/status/${selectedUser.uid}`);
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setIsOnline(data.state === "online");
      } else {
        setIsOnline(false);
      }
    });

    return () => unsubscribe();
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
              isOnline ? "text-green-500" : "text-gray-400"
            }`}
          >
            ● {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Right: logout button */}
      <button onClick={handleLogout} title="Logout">
        <LogOut className="text-gray-500 hover:text-red-500 w-5 h-5" />
      </button>
    </div>
  );
};

export default ChatHeader;
