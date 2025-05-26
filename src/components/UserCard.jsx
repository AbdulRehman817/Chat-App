import React from "react";
import { useChat } from "../context/ChatContext";

const UserCard = ({ user }) => {
  const { setSelectedUser } = useChat();

  return (
    <div
      onClick={() => setSelectedUser(user)}
      className="cursor-pointer p-3 hover:bg-gray-100 flex gap-4 items-center rounded-lg"
    >
      <img
        src={user.photoURL}
        alt={user.displayName}
        className="w-12 h-12 rounded-full shadow-sm"
      />
      <div>
        <h3 className="font-semibold">{user.displayName}</h3>
        <p className="text-xs text-gray-400">
          {user.online ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
};

export default UserCard;
