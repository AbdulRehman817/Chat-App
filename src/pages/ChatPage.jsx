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
  const { selectedUser } = useChat();
  const { currentUser } = useAuth();
  const [isTyping, setIsTyping] = useState(false);

  // Define chatId here so it can be passed to <MessageInput />
  const chatId =
    selectedUser && currentUser
      ? currentUser.uid > selectedUser.uid
        ? currentUser.uid + selectedUser.uid
        : selectedUser.uid + currentUser.uid
      : null;

  useEffect(() => {
    if (!selectedUser || !currentUser) return;

    const typingRef = ref(rtdb, `typingStatus/${chatId}/${selectedUser.uid}`);

    const unsubscribe = onValue(typingRef, (snapshot) => {
      const typing = snapshot.val();
      setIsTyping(typing === true);
    });

    return () => unsubscribe();
  }, [selectedUser, currentUser, chatId]);

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r border-gray-300">
        <UsersList />
      </div>

      <div className="flex flex-col flex-1">
        {selectedUser ? (
          <>
            <Header user={selectedUser} />
            <SendMessage />
            {isTyping && <TypingIndicator />}
            <MessageInput chatId={chatId} selectedUser={selectedUser} />
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
