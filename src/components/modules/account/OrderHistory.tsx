"use client";

// Define the structure of our order data for TypeScript
interface Order {
  id: string;
  date: string;
  status: 'Fulfilled' | 'Unfulfilled';
  total: string;
}

// Using placeholder data until we connect to Shopify
const placeholderOrders: Order[] = [
  { id: '#SB2025-004', date: 'July 15, 2025', status: 'Fulfilled', total: '370.00' },
  { id: '#SB2025-003', date: 'July 12, 2025', status: 'Fulfilled', total: '120.00' },
  { id: '#SB2025-002', date: 'July 10, 2025', status: 'Unfulfilled', total: '420.00' },
  { id: '#SB2025-001', date: 'July 05, 2025', status: 'Fulfilled', total: '80.00' },
];

// Define the props for our OrderCard component
const OrderCard = ({ order }: { order: Order }) => (
  <div className="p-6 border border-white/10 rounded-lg flex justify-between items-center transition-colors hover:bg-white/5">
    <div className="flex flex-col">
      <span className="font-display font-bold text-lg">{order.id}</span>
      <span className="font-sans text-xs text-white/50 mt-1">{order.date}</span>
    </div>
    <div className="text-right">
      <span className={`font-sans text-xs uppercase tracking-widest px-2 py-1 rounded ${order.status === 'Fulfilled' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
        {order.status}
      </span>
      <p className="font-mono text-lg mt-2">${order.total}</p>
    </div>
  </div>
);

const OrderHistory = () => {
  return (
    <div className="flex flex-col gap-4">
      {placeholderOrders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrderHistory;