import React, { useState, useEffect, useRef } from 'react';

const SSEView = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Initialize SSE connection
    const connectSSE = () => {
      try {
        const eventSource = new EventSource('http://localhost:5000/api/sse');
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          setIsConnected(true);
          setMessages(prev => [...prev, 'SSE connection opened']);
        };

        eventSource.onmessage = (event) => {
          setMessages(prev => [...prev, `Server: ${event.data}`]);
        };

        eventSource.onerror = (error) => {
          console.error('SSE error:', error);
          setIsConnected(false);
          setMessages(prev => [...prev, 'SSE connection error']);
        };

        // Listen for custom events
        eventSource.addEventListener('auction-update', (event) => {
          setMessages(prev => [...prev, `Auction Update: ${event.data}`]);
        });

        eventSource.addEventListener('bid-placed', (event) => {
          setMessages(prev => [...prev, `New Bid: ${event.data}`]);
        });

      } catch (error) {
        console.error('Failed to create SSE connection:', error);
        setMessages(prev => [...prev, 'Failed to connect to SSE server']);
      }
    };

    connectSSE();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        setIsConnected(false);
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages(prev => [...prev, `You: ${newMessage}`]);
      setNewMessage('');
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      setIsConnected(false);
      setMessages(prev => [...prev, 'SSE connection closed']);
    }
  };

  const reconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    setIsConnected(false);
    setMessages(prev => [...prev, 'Reconnecting...']);

    setTimeout(() => {
      const eventSource = new EventSource('http://localhost:5000/api/sse');
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        setMessages(prev => [...prev, 'SSE connection reopened']);
      };

      eventSource.onmessage = (event) => {
        setMessages(prev => [...prev, `Server: ${event.data}`]);
      };

      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        setIsConnected(false);
        setMessages(prev => [...prev, 'SSE connection error']);
      };
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Server-Sent Events (SSE)</h2>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">
              Status: {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Endpoint: http://localhost:5000/api/sse
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={reconnect}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {isConnected ? 'Reconnect' : 'Connect'}
          </button>
          <button
            onClick={disconnect}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            disabled={!isConnected}
          >
            Disconnect
          </button>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 mb-4 h-64 overflow-y-auto bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">SSE Messages</h3>
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
            placeholder="Type a message (client-side only)..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
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
        <h3 className="text-xl font-bold text-gray-800 mb-4">SSE Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Connection Status:</span>
            <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Event Types:</span>
            <span>message, auction-update, bid-placed</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Auto-reconnect:</span>
            <span>Browser handles automatically</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Code Example</h3>
        <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
          {`// Client-side SSE implementation
const eventSource = new EventSource('http://localhost:5000/api/sse');

eventSource.onopen = () => {
  console.log('SSE connection opened');
};

eventSource.onmessage = (event) => {
  console.log('Received:', event.data);
};

eventSource.addEventListener('auction-update', (event) => {
  console.log('Auction update:', event.data);
});

eventSource.onerror = (error) => {
  console.error('SSE error:', error);
};

// Close connection
eventSource.close();`}
        </pre>
      </div>
    </div>
  );
};

export default SSEView;
