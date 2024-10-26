import React, { useState } from 'react';
import { Send, Mic, MicOff, Monitor, Video } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Chat = () => {
  const [message, setMessage] = useState('');
  const { messages, currentUser, addMessage } = useStore();

  const handleSend = () => {
    if (!message.trim() || !currentUser) return;
    
    addMessage({
      id: Date.now().toString(),
      userId: currentUser.id,
      text: message,
      timestamp: Date.now(),
    });
    
    setMessage('');
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-800">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.userId === currentUser?.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.userId === currentUser?.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <p>{msg.text}</p>
              <span className="text-xs opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
              <Mic className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
              <Monitor className="w-5 h-5" />
            </button>
          </div>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            onClick={handleSend}
            className="p-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};