// // import React from "react";
// // import { useChat } from "../context/ChatContext";

// // const UserCard = ({ user, lastMessage }) => {
// //   const { selectedUser, setSelectedUser } = useChat();
// //   const isSelected = selectedUser?.uid === user.uid;

// //   return (
// //     <div
// //       onClick={() => setSelectedUser(user)}
// //       className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
// //         isSelected ? "bg-[#2a3942]" : "hover:bg-[#202c33]"
// //       }`}
// //     >
// //       <img
// //         src={user.photoURL}
// //         alt={user.displayName}
// //         className="w-12 h-12 rounded-full object-cover"
// //       />
// //       <div className="flex flex-col overflow-hidden">
// //         <p className="text-white font-medium truncate">{user.displayName}</p>
// //         <p className="text-sm text-gray-400 truncate max-w-[180px]">
// //           {lastMessage ? lastMessage.text || "Image" : "Start a chat"}
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default UserCard;
// import React from "react";
// import { useChat } from "../context/ChatContext";

// const UserCard = ({ user, lastMessage }) => {
//   const { selectedUser, setSelectedUser } = useChat();
//   const isSelected = selectedUser?.uid === user.uid;

//   return (
//     <div
//       onClick={() => setSelectedUser(user)}
//       className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
//         isSelected ? "bg-[#2a3942]" : "hover:bg-[#202c33]"
//       }`}
//     >
//       <img
//         src={user.photoURL}
//         alt={user.displayName}
//         className="w-12 h-12 rounded-full object-cover"
//       />
//       <div className="flex flex-col overflow-hidden">
//         <p className="text-white font-medium truncate">{user.displayName}</p>
//         <p className="text-sm text-gray-400 truncate max-w-[180px]">
//           {lastMessage ? lastMessage.text || "Image" : "Start a chat"}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default UserCard;
import React from "react";
import { useChat } from "../context/ChatContext";

const UserCard = ({ user, lastMessage }) => {
  const { selectedUser, setSelectedUser } = useChat();
  const isSelected = selectedUser?.uid === user.uid;

  return (
    <div
      onClick={() => setSelectedUser(user)}
      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors 
        ${isSelected ? "bg-[#2a3942]" : "hover:bg-[#202c33]"} 
        w-full max-w-full sm:px-4 sm:py-3`}
    >
      <img
        src={user.photoURL}
        alt={user.displayName}
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
      />
      <div className="flex flex-col overflow-hidden w-full">
        <p className="text-white font-medium text-sm sm:text-base truncate">
          {user.displayName}
        </p>
        <p className="text-xs sm:text-sm text-gray-400 truncate max-w-[200px] sm:max-w-[240px]">
          {lastMessage ? lastMessage.text || "Image" : "Start a chat"}
        </p>
      </div>
    </div>
  );
};

export default UserCard;
