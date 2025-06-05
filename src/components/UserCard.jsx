import React from "react";
import { useChat } from "../context/ChatContext";

const UserCard = ({ user, lastMessage }) => {
  const { selectedUser, setSelectedUser } = useChat();
  const isSelected = selectedUser?.uid === user.uid;

  return (
    <div
      onClick={() => setSelectedUser(user)}
      className={`flex items-center gap-3 p-2 sm:p-3 md:p-4 cursor-pointer transition-colors 
        ${isSelected ? "bg-[#2a3942]" : "hover:bg-[#202c33]"} 
        w-full`}
    >
      {/* User Image */}
      <img
        src={user.photoURL}
        alt={user.displayName}
        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover flex-shrink-0"
      />

      {/* Name and Last Message */}
      <div className="flex flex-col overflow-hidden w-full pr-2">
        <p className="text-white font-semibold text-sm sm:text-base md:text-lg truncate leading-tight">
          {user.displayName}
        </p>
        <p className="text-gray-400 text-xs sm:text-sm md:text-base truncate leading-snug">
          {lastMessage ? lastMessage.text || "Image" : "Start a chat"}
        </p>
      </div>
    </div>
  );
};

export default UserCard;
