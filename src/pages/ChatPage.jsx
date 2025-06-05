import { useState, useEffect } from "react";
import UsersList from "../components/UserList";
import SendMessage from "../components/SendMessage";
import MessageInput from "../components/MessageInput";
import Header from "../components/Header";
import TypingIndicator from "../TypingIndicator/TypingIndicator";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

const ChatPage = () => {
  const { currentUser } = useAuth();
  const { selectedUser } = useChat();
  const [isTyping, setIsTyping] = useState(false);

  // Track if screen is mobile-sized
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Control if sidebar is open (on mobile)
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Update isMobile on window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      // Automatically close sidebar on mobile when a chat is selected
      if (mobile && selectedUser) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize on mount

    return () => window.removeEventListener("resize", handleResize);
  }, [selectedUser]);

  // Whenever selectedUser changes on mobile, close sidebar
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(selectedUser ? false : true);
    }
  }, [selectedUser, isMobile]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 bottom-0 z-40
          w-full max-w-xs h-screen bg-white border-r border-gray-300
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6
          overflow-y-auto
        `}
      >
        <UsersList />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Chat Section */}
      <div
        className={`
          flex flex-col flex-1 bg-white w-full
          transition-transform duration-300 ease-in-out
          ${
            isMobile
              ? sidebarOpen
                ? "translate-x-full"
                : "translate-x-0"
              : "translate-x-0"
          }
        `}
      >
        {selectedUser ? (
          <>
            {/* Header with Back Button on mobile */}
            <Header
              user={selectedUser}
              showBackButton={isMobile}
              onBack={() => {
                setSelectedUser(null);
                if (isMobile) setSidebarOpen(true);
              }}
            />

            <div className="flex flex-col flex-1 overflow-hidden">
              <SendMessage />
              {/* Include your typing indicator here */}
              {isTyping && <TypingIndicator user={selectedUser} />}
              <MessageInput />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-400 text-lg p-4 text-center">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
