interface ConnectionStatusProps {
  isConnected: boolean;
  onReconnect: () => void;
  onDisconnect: () => void;
  onResetAuction: () => void;
}

const ConnectionStatus = ({
  isConnected,
  onReconnect,
  onDisconnect,
  onResetAuction
}: ConnectionStatusProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className='flex col justify-between items-start'>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Server-Sent Events (SSE) Auction</h2>
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
          <div>
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
        <div className="flex gap-2 mb-4 align-baseline justify-baseline">
          {!isConnected && <button
            onClick={onReconnect}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Reconnect
          </button>}
          {isConnected && <button
            onClick={onDisconnect}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            disabled={!isConnected}
          >
            Disconnect
          </button>}
          <button
            onClick={onResetAuction}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            Reset Auction
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus;
