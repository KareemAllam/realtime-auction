import { useState, useEffect } from 'react';
import useAuction from '../context/useAuction';
import IsConnected from './isConnected';

const WebSocketsView = () => {
  const { state } = useAuction();
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Add connection status messages
    if (state.connected) {
      setMessages(prev => [...prev, 'Connected to WebSocket server']);
    } else {
      setMessages(prev => [...prev, 'Disconnected from WebSocket server']);
    }
  }, [state.connected]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages(prev => [...prev, `You: ${newMessage}`]);
      setNewMessage('');
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <IsConnected />

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">WebSocket Connection</h2>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${state.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">
              Status: {state.connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Socket ID: {state.currentUserId || 'Not connected'}
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 mb-4 h-64 overflow-y-auto bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Connection Log</h3>
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages yet...</p>
          ) : (
            <div className="space-y-1">
              {messages.map((message, index) => (
                <div key={index} className="text-sm text-gray-700">
                  {message}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
          <button
            onClick={clearMessages}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">WebSocket Events</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Connection Status:</span>
            <span className={state.connected ? 'text-green-600' : 'text-red-600'}>
              {state.connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Current Product:</span>
            <span>{state.product?.name || 'No product loaded'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Current Price:</span>
            <span>${state.product?.currentPrice || '0'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Total Bids:</span>
            <span>{state.product?.bids.length || '0'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSocketsView;
