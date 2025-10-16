import useAuction from '../context/useAuction';

export default function IsConnected() {
  const { state } = useAuction();

  return (
    <div className="mt-2">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${state.connected
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800'
        }`}>
        <span className={`w-2 h-2 rounded-full mr-1.5 ${state.connected ? 'bg-green-400' : 'bg-red-400'
          }`}></span>
        {state.connected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
}