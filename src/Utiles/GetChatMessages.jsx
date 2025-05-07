import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../routes/firebaseConfig';

const ChatMessages = ({ chatId, userId }) => {
  const [lastReceiverMessage, setLastReceiverMessage] = useState(null);

  useEffect(() => {
    if (!chatId) return;
    const stringChatId = String(chatId);
    const messagesRef = collection(db, "headstaart", stringChatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      const receiverMessages = fetchedMessages.filter(
        message => message.sender_unique_id !== userId
      );
      const lastMessage = receiverMessages[receiverMessages.length - 1];
      setLastReceiverMessage(lastMessage);
    });

    return () => unsubscribe();
  }, [chatId, userId]);

  if (!lastReceiverMessage) {
    return <div className="text-gray-500">No messages yet</div>;
  }

  return (
      <div
        key={lastReceiverMessage.id}
        className="p-2 w-fit rounded-lg bg-[#F1F1F1] text-black self-start text-left mr-auto"
      >
        <h1>
          {(lastReceiverMessage.text || lastReceiverMessage.message || '').split(/\n/).map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </h1>
      </div>
  );
};

export default ChatMessages;