import OrderHistory from '@/components/modules/account/OrderHistory';
// THE FIX: We import the exact same logic as the orders page
import { getCustomer } from '@/lib/shopify';
import { cookies } from 'next/headers';

// THE FIX: This page is now a Server Component and will fetch data
const AccountDashboardPage = async () => {
  const cookieStore = cookies();
  const customerAccessToken = cookieStore.get('swambasic_customer_token')?.value;

  // Agar token nahi hai, toh ek empty array bhej do
  if (!customerAccessToken) {
    return <OrderHistory orders={[]} />;
  }

  // Real-time data fetch karo
  const customer = await getCustomer(customerAccessToken);
  const orders = customer ? customer.orders.edges.map(edge => edge.node) : [];

  // Component ko asli data ke saath render karo
  return <OrderHistory orders={orders} />;
};

export default AccountDashboardPage;