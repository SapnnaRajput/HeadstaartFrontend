import React, { useState, useRef, useEffect } from 'react';
import { Modal } from 'flowbite-react';
import { Send } from 'lucide-react';
import axios from 'axios';
import { UserState } from '../../../context/UserContext';

const ChatModal = ({ 
  isOpen, 
  onClose, 
  chatDetails: initialChatDetails, 
  headstaartChatInitiateId,
  senderUniqueId,
  receiverUniqueId,
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [chatMessages, setChatMessages] = useState(initialChatDetails);
  const messagesEndRef = useRef(null);
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();

  
  useEffect(() => {
    setChatMessages(initialChatDetails);
  }, [initialChatDetails]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const formatDate = (date, time) => {
    return new Date(`${date} ${time}`).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    setIsSending(true);
    try {
      const response = await axios.post(`${baseUrl}/send_headstart_message`, {
        headstaart_chat_initiate_id: headstaartChatInitiateId,
        message: message.trim(),
        sender_unique_id: senderUniqueId,
        reciver_unique_id: receiverUniqueId
      }, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.data.status) {
        // Add the new message to the chat messages
        const newMessage = response.data.message;
        setChatMessages(prevMessages => [...prevMessages, {
          sender_id: newMessage.send_id,
          receiver_id: newMessage.receive_id,
          message: newMessage.headstaart_chat_message,
          sender_role: newMessage.sender_role,
          inserted_date: newMessage.inserted_date,
          inserted_time: newMessage.inserted_time,
        }]);
        setMessage('');
      } else {
        console.error('Failed to send message:', response.data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };
  

  return (
    <Modal show={isOpen} onClose={onClose} size="xl" className="h-full">
      <div className="flex flex-col h-[70vh]">
        <Modal.Header>Chat</Modal.Header>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="space-y-4">
            {chatMessages.map((chat, index) => {
              const isSender = chat.sender_role === 'entrepreneur' || chat.sender_role === 'agent' || chat.sender_role === 'investor';
              return (
                <div
                  key={index}
                  className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      isSender
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-800 border'
                    }`}
                  >
                    <p className="text-sm">{chat.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isSender ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {formatDate(chat.inserted_date, chat.inserted_time)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              disabled={isSending}
            />
            <button
              type="button"
              disabled={!message.trim() || isSending}
              onClick={handleSubmit}
              className="p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ChatModal;