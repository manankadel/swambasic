import Addresses from '@/components/modules/account/Addresses';
// We use the same logic to fetch the customer data
import { getCustomer } from '@/lib/shopify';
import { cookies } from 'next/headers';

// This page is now a Server Component
const AccountAddressesPage = async () => {
  const cookieStore = cookies();
  const customerAccessToken = cookieStore.get('swambasic_customer_token')?.value;

  if (!customerAccessToken) {
    return <Addresses addresses={[]} />;
  }
  
  const customer = await getCustomer(customerAccessToken);
  // We extract the addresses from the customer object
  const addresses = customer ? customer.addresses.edges.map(edge => edge.node) : [];

  return <Addresses addresses={addresses} />;
};

export default AccountAddressesPage;