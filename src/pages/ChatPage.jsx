import React from "react";
import UsersList from "../components/UserList";
import MessageList from "../components/SendMessage";
import SendMessage from "../components/SendMessage";
import Header from "../components/Header"; // Optional
import { useChat } from "../context/ChatContext";

const ChatPage = () => {
  const { selectedUser } = useChat();

  return (
    <div className="flex h-screen">
      {/* Sidebar with users */}
      <div className="w-1/4 border-r border-gray-300">
        <UsersList />
      </div>

      {/* Chat area */}
      <div className="flex flex-col flex-1">
        {selectedUser ? (
          <>
            {/* Optional header showing user profile */}
            <Header user={selectedUser} />

            {/* Messages */}
            <MessageList />

            {/* Input for sending messages */}
            <SendMessage />
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-400 text-xl">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
