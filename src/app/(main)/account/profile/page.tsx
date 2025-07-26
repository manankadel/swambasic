import ProfileDetails from '@/components/modules/account/ProfileDetails';
// We use the same logic to fetch the customer data
import { getCustomer } from '@/lib/shopify';
import { cookies } from 'next/headers';

// This page is now a Server Component
const AccountProfilePage = async () => {
  const cookieStore = cookies();
  const customerAccessToken = cookieStore.get('swambasic_customer_token')?.value;

  if (!customerAccessToken) {
    // This is a fallback, middleware should prevent this.
    return <ProfileDetails customer={null} />;
  }

  // Fetch the full customer object
  const customer = await getCustomer(customerAccessToken);

  // Pass the entire customer object to the component
  return <ProfileDetails customer={customer} />;
};

export default AccountProfilePage;