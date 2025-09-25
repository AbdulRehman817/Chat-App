// import React, { useEffect, useState } from "react";
// import { collection, query, onSnapshot, doc, getDoc } from "firebase/firestore";
// import { db } from "../firebase/firebaseConfig";
// import { useAuth } from "../context/AuthContext";
// import UserCard from "./UserCard";
// import ProfilePopup from "./ProfilePopup";

// const UsersList = () => {
//   const [users, setUsers] = useState([]);
//   const [lastMessages, setLastMessages] = useState({});
//   const [showPopup, setShowPopup] = useState(false);
//   const { currentUser } = useAuth();

//   useEffect(() => {
//     if (!currentUser) return;

//     const q = query(collection(db, "users"));

//     const unsubscribe = onSnapshot(q, async (snapshot) => {
//       const usersArray = snapshot.docs
//         .filter((doc) => doc.id !== currentUser.uid) // Exclude current user
//         .map((doc) => ({
//           uid: doc.id,
//           ...doc.data(),
//         }));

//       setUsers(usersArray);

//       // Fetch last messages
//       const messagesObj = {};
//       for (const user of usersArray) {
//         const chatId =
//           currentUser.uid > user.uid
//             ? currentUser.uid + user.uid
//             : user.uid + currentUser.uid;

//         const chatDoc = await getDoc(doc(db, "lastMessages", chatId));
//         if (chatDoc.exists()) {
//           messagesObj[user.uid] = chatDoc.data();
//         }
//       }
//       setLastMessages(messagesObj);
//     });

//     return () => unsubscribe();
//   }, [currentUser]);

//   if (!currentUser) return null;

//   return (
//     <>
//       <div className="overflow-y-auto h-full bg-[#111b21] border-r border-gray-700 relative pb-20">
//         <h1 className="text-white bg-[#111b21] font-medium text-2xl text-center py-4">
//           Chats
//           <div className="border-b border-gray-500 mx-5 mt-3 opacity-40" />
//         </h1>

//         {users.map((user, index) => (
//           <div key={user.uid}>
//             <UserCard user={user} lastMessage={lastMessages[user.uid]} />
//             {index < users.length - 1 && (
//               <div className="border-b border-gray-400 mx-5 opacity-50" />
//             )}
//           </div>
//         ))}

//         {/* Profile Avatar at Bottom */}
//         <div className="absolute bottom-4 w-full flex justify-center">
//           <img
//             src={currentUser.photoURL || "/default-avatar.png"}
//             alt="Me"
//             onClick={() => setShowPopup(true)}
//             className="w-12 h-12 rounded-full cursor-pointer border-2 border-gray-600 hover:border-white"
//           />
//         </div>
//       </div>

//       {/* Popup for current user's profile */}
//       {showPopup && (
//         <ProfilePopup user={currentUser} onClose={() => setShowPopup(false)} />
//       )}
//     </>
//   );
// };

// export default UsersList;
import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import UserCard from "./UserCard";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [lastMessages, setLastMessages] = useState({});

  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const usersArray = snapshot.docs
        .filter((doc) => doc.id !== currentUser.uid)
        .map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));

      setUsers(usersArray);

      const messagesObj = {};
      for (const user of usersArray) {
        const chatId =
          currentUser.uid > user.uid
            ? currentUser.uid + user.uid
            : user.uid + currentUser.uid;

        const chatDoc = await getDoc(doc(db, "lastMessages", chatId));
        if (chatDoc.exists()) {
          messagesObj[user.uid] = chatDoc.data();
        }
      }
      setLastMessages(messagesObj);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <>
      <div
        className="h-full bg-[#111b21] border-r border-gray-700 
        w-full 
        flex flex-col relative"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#111b21]">
          <h1 className="text-white text-center font-semibold text-lg sm:text-xl md:text-2xl py-4">
            Chats
          </h1>
          <div className="border-b border-gray-500 mx-4 opacity-30" />
        </div>

        {/* Chat Users List */}
        <div className="flex-1 overflow-y-auto px-1 sm:px-2 pt-2 pb-20">
          {users.map((user, index) => (
            <div key={user.uid}>
              <UserCard user={user} lastMessage={lastMessages[user.uid]} />
              {index < users.length - 1 && (
                <div className="border-b border-gray-600 mx-4 opacity-30" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom Avatar */}
        <div className="absolute bottom-4 w-full flex justify-center">
          <img
            src={currentUser.photoURL || "/default-avatar.png"}
            alt="Me"
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full cursor-pointer border-2 border-gray-600 hover:border-white transition"
          />
        </div>
      </div>

      {/* Profile Popup */}
    </>
  );
};

export default UsersList;
