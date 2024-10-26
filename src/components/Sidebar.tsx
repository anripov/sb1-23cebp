import React from 'react';
import { Users, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Sidebar = () => {
  const users = useStore((state) => state.users);
  const currentUser = useStore((state) => state.currentUser);

  return (
    <div className="w-64 bg-gray-900 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-white text-xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6" />
          Modern Messenger
        </h1>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-gray-400 text-sm font-semibold mb-2">ONLINE - {users.length}</h2>
          {users.map((user) => (
            <div
              key={user.id}
              className={`flex items-center gap-2 text-gray-300 py-2 px-2 rounded hover:bg-gray-800 cursor-pointer ${
                currentUser?.id === user.id ? 'bg-gray-800' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                {user.name[0].toUpperCase()}
              </div>
              <span>{user.name}</span>
              {user.isScreenSharing && (
                <span className="ml-auto text-xs bg-green-500 text-white px-2 py-1 rounded">
                  Sharing
                </span>
              )}
              {user.isMuted && (
                <span className="ml-auto text-xs bg-red-500 text-white px-2 py-1 rounded">
                  Muted
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-800">
        <button className="w-full flex items-center gap-2 text-gray-400 hover:text-white">
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </div>
    </div>
  );
};