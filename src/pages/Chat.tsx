import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Monitor, Video, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const socket = io('http://localhost:3001');

export const Chat = () => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, currentUser, addMessage, logout } = useStore();

  useEffect(() => {
    if (currentUser) {
      socket.emit('join', currentUser);
      
      socket.on('message', (message) => {
        addMessage(message);
      });

      socket.on('userJoined', (user) => {
        toast.success(`${user.username} joined the chat`);
      });

      socket.on('userLeft', (userId) => {
        const user = messages.find(m => m.userId === userId);
        if (user) {
          toast.error(`${user.username} left the chat`);
        }
      });
    }

    return () => {
      socket.off('message');
      socket.off('userJoined');
      socket.off('userLeft');
    };
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim() || !currentUser) return;
    
    const newMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      text: message,
      timestamp: Date.now(),
    };
    
    socket.emit('message', newMessage);
    setMessage('');
  };

  const handleLogout = () => {
    socket.disconnect();
    logout();
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-800 p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">Modern Messenger</h1>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex ${
                  msg.userId === currentUser?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 shadow-lg message-bubble ${
                    msg.userId === currentUser?.id
                      ? 'bg-blue-600 text-white message-sent'
                      : 'bg-gray-700 text-gray-100 message-received'
                  }`}
                >
                  {msg.userId !== currentUser?.id && (
                    <p className="text-sm font-medium text-gray-300 mb-1">
                      {msg.username}
                    </p>
                  )}
                  <p className="text-lg">{msg.text}</p>
                  <p className="text-xs mt-2 opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>

        <div className="border-t border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
              >
                <Mic className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
              >
                <Video className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
              >
                <Monitor className="w-5 h-5" />
              </motion.button>
            </div>
            
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              className="p-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};