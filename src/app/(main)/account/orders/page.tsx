import OrderHistory from '@/components/modules/account/OrderHistory';
import { getCustomer } from '@/lib/shopify';
import { cookies } from 'next/headers';

// This is now a Server Component
const AccountOrdersPage = async () => {
  const cookieStore = cookies();
  const customerAccessToken = cookieStore.get('swambasic_customer_token')?.value;

  if (!customerAccessToken) {
    // Middleware should handle this, but as a fallback
    return <OrderHistory orders={[]} />;
  }

  const customer = await getCustomer(customerAccessToken);
  const orders = customer ? customer.orders.edges.map(edge => edge.node) : [];

  return <OrderHistory orders={orders} />;
};

export default AccountOrdersPage;