import { useState, useEffect } from "react";
import { onValue, ref } from "firebase/database";
import UsersList from "../components/UserList";
import SendMessage from "../components/SendMessage";
import MessageInput from "../components/MessageInput";
import Header from "../components/Header";
import TypingIndicator from "../TypingIndicator/TypingIndicator";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { rtdb } from "../firebase/firebaseConfig";

const ChatPage = () => {
  const { selectedUser, setSelectedUser } = useChat();
  const { currentUser } = useAuth();
  const [isTyping, setIsTyping] = useState(false);

  const chatId =
    selectedUser && currentUser
      ? currentUser.uid > selectedUser.uid
        ? currentUser.uid + selectedUser.uid
        : selectedUser.uid + currentUser.uid
      : null;

  // Handle typing status
  useEffect(() => {
    if (!selectedUser || !currentUser) return;

    const typingRef = ref(rtdb, `typingStatus/${chatId}/${selectedUser.uid}`);
    const unsubscribe = onValue(typingRef, (snapshot) => {
      const typing = snapshot.val();
      setIsTyping(typing === true);
    });

    return () => unsubscribe();
  }, [selectedUser, currentUser, chatId]);

  // Automatically close chat view on small screens when resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && selectedUser) {
        setSelectedUser(null);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedUser, setSelectedUser]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`
          border-r border-gray-300 bg-white
          fixed top-0 left-0 bottom-0 z-30
          w-full max-w-xs
          transform transition-transform duration-300 ease-in-out
          ${selectedUser ? "-translate-x-full" : "translate-x-0"}
          md:relative md:translate-x-0 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6
          overflow-y-auto
        `}
      >
        <UsersList />
      </div>

      {/* Overlay on mobile when chat open */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-opacity-50 z-20 md:hidden"
          onClick={() => setSelectedUser(null)}
        />
      )}

      {/* Chat Section */}
      <div
        className={`
          flex flex-col flex-1 bg-white w-full
          transition-transform duration-300 ease-in-out
          ${
            selectedUser ? "translate-x-0" : "translate-x-full md:translate-x-0"
          }
        `}
      >
        {selectedUser ? (
          <>
            {/* Back button on mobile */}
            <Header
              user={selectedUser}
              showBackButton={true}
              onBack={() => setSelectedUser(null)}
            />

            <div className="flex flex-col flex-1 overflow-hidden">
              <SendMessage />
              {isTyping && <TypingIndicator />}
              <MessageInput chatId={chatId} selectedUser={selectedUser} />
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
