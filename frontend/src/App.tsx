import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import ProductDetail from './websocket/ProductDetail';
import WebSocketsView from './websocket/WebSocketsView';
import SSEView from './sse/SSEView';
import AuctionProvider from './websocket/context/AuctionProvider';

function AppContent() {
  const [currentView, setCurrentView] = useState<'auction' | 'websockets' | 'sse'>('auction');

  const handleViewChange = (view: 'auction' | 'websockets' | 'sse') => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <header className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Live Auction</h1>
          <nav className="mt-4">
            <button
              onClick={() => handleViewChange('auction')}
              className={`mx-2 px-4 py-2 rounded-md ${currentView === 'auction'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Auction
            </button>
            <button
              onClick={() => handleViewChange('websockets')}
              className={`mx-2 px-4 py-2 rounded-md ${currentView === 'websockets'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              WebSockets
            </button>
            <button
              onClick={() => handleViewChange('sse')}
              className={`mx-2 px-4 py-2 rounded-md ${currentView === 'sse'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Server-Sent Events
            </button>
          </nav>
        </div>
      </header>

      <main className="py-8 max-w-6xl mx-auto px-4">
        {currentView === 'auction' && <ProductDetail />}
        {currentView === 'websockets' && <WebSocketsView />}
        {currentView === 'sse' && <SSEView />}
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

function App() {
  return (
    <AuctionProvider>
      <AppContent />
    </AuctionProvider>
  );
}

export default App;
