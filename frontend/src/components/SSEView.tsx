import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

interface AuctionState {
  product: any;
  bids: any[];
  currentPrice: number;
}

interface BidUpdate {
  productId: string;
  newPrice: number;
  bidder: string;
  bidderId: string;
  timestamp: string;
  bidId: string;
}

const SSEView = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidderName, setBidderName] = useState('');
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
          toast.success('Connected to SSE server', {
            position: "top-right",
            autoClose: 2000,
          });
        };

        eventSource.onmessage = (event) => {
          setMessages(prev => [...prev, `Server: ${event.data}`]);
        };

        eventSource.onerror = (error) => {
          console.error('SSE error:', error);
          setIsConnected(false);
          setMessages(prev => [...prev, 'SSE connection error']);
          toast.error('SSE connection error', {
            position: "top-right",
            autoClose: 3000,
          });
        };

        // Listen for auction state updates
        eventSource.addEventListener('auction-state', (event) => {
          const data = JSON.parse(event.data);
          setAuctionState(data);
          setMessages(prev => [...prev, `Auction State: ${JSON.stringify(data, null, 2)}`]);
        });

        // Listen for bid updates
        eventSource.addEventListener('bid-update', (event) => {
          const data: BidUpdate = JSON.parse(event.data);
          setAuctionState(prev => {
            if (prev) {
              return {
                ...prev,
                currentPrice: data.newPrice,
                bids: [...prev.bids, {
                  id: data.bidId,
                  bidderId: data.bidderId,
                  bidderName: data.bidder,
                  amount: data.newPrice,
                  timestamp: new Date(data.timestamp)
                }]
              };
            }
            return prev;
          });
          setMessages(prev => [...prev, `New Bid: $${data.newPrice} by ${data.bidder}`]);
          toast.info(`New bid: $${data.newPrice} by ${data.bidder}`, {
            position: "top-right",
            autoClose: 3000,
          });
        });

        // Listen for auction reset
        eventSource.addEventListener('auction-reset', (event) => {
          const data = JSON.parse(event.data);
          setAuctionState({
            product: data.product,
            bids: [],
            currentPrice: data.product.currentPrice
          });
          setMessages(prev => [...prev, `Auction Reset: ${data.message}`]);
          toast.warning('Auction has been reset', {
            position: "top-right",
            autoClose: 3000,
          });
        });

        // Listen for heartbeat
        eventSource.addEventListener('heartbeat', (event) => {
          const data = JSON.parse(event.data);
          setMessages(prev => [...prev, `Heartbeat: ${data.timestamp}`]);
        });

      } catch (error) {
        console.error('Failed to create SSE connection:', error);
        setMessages(prev => [...prev, 'Failed to connect to SSE server']);
        toast.error('Failed to connect to SSE server', {
          position: "top-right",
          autoClose: 3000,
        });
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

  const handlePlaceBid = async () => {
    if (!bidAmount || !bidderName) {
      toast.error('Please enter both bidder name and amount', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid bid amount', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/sse/auction/bid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bidderId: `user-${Date.now()}`,
          bidderName: bidderName,
          amount: amount
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Your bid of $${amount} was placed successfully!`, {
          position: "top-right",
          autoClose: 3000,
        });
        setBidAmount('');
        setBidderName('');
      } else {
        toast.error(data.message || 'Failed to place bid', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      toast.error('Failed to place bid', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleResetAuction = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sse/auction/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Auction reset successfully', {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(data.message || 'Failed to reset auction', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error resetting auction:', error);
      toast.error('Failed to reset auction', {
        position: "top-right",
        autoClose: 3000,
      });
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
    <div className="max-w-6xl mx-auto">
      {/* Connection Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className='flex col justify-between'>
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
              <button
                onClick={handleResetAuction}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                Reset Auction
              </button>
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
      </div>

      {/* Auction State */}
      {auctionState && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Current Auction</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <img
                src={auctionState.product?.imageUrl}
                alt={auctionState.product?.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h4 className="text-lg font-semibold text-gray-800">{auctionState.product?.name}</h4>
              <p className="text-gray-600 mb-2">{auctionState.product?.description}</p>
              <div className="text-2xl font-bold text-green-600">
                Current Price: ${auctionState.currentPrice}
              </div>
              <div className="text-gray-500">
                Total Bids: {auctionState.bids.length}
              </div>
            </div>
            <div>
              <h5 className="text-lg font-semibold text-gray-800 mb-3">Recent Bids</h5>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {auctionState.bids.slice(-5).reverse().map((bid, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span className="font-semibold text-gray-800">{bid.bidderName}</span>
                    <span className="font-bold text-green-600">${bid.amount}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(bid.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
                {auctionState.bids.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No bids yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bid Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Place a Bid</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
            <input
              type="text"
              value={bidderName}
              onChange={(e) => setBidderName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bid Amount</label>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter bid amount"
              min={auctionState?.currentPrice || 0}
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handlePlaceBid}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Place Bid
            </button>
          </div>
        </div>
      </div>



    </div>
  );
};

export default SSEView;
