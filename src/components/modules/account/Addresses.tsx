"use client";

// Define the structure of an address object
interface Address {
  address1: string;
  address2?: string; // Optional property
  city: string;
  province: string;
  zip: string;
  country: string;
}

// Placeholder data, to be replaced by Shopify customer addresses
const placeholderAddress: Address = {
  address1: '42,',
  address2: 'Dhanraj Villa',
  city: 'Jaipur',
  province: 'Rajasthan',
  zip: '302020',
  country: 'India'
};

// Define the props for our AddressCard component
const AddressCard = ({ address }: { address: Address }) => (
  <div className="p-6 border border-white/10 rounded-lg">
    <p className="font-sans">
      {address.address1}<br />
      {address.address2 && <>{address.address2}<br /></>}
      {address.city}, {address.province} {address.zip}<br />
      {address.country}
    </p>
    <div className="mt-4 flex gap-4 font-sans text-xs uppercase tracking-wider">
      <button className="hover:text-white">Edit</button>
      <button className="hover:text-red-400">Delete</button>
    </div>
  </div>
);

const Addresses = () => {
  return (
    <div className="max-w-lg space-y-8">
        <div className="flex justify-between items-center">
            <h2 className="font-display text-3xl font-bold">Your Addresses</h2>
            <button className="px-6 py-2 border border-white/50 text-xs font-sans uppercase tracking-wider hover:bg-white hover:text-black transition-colors">
                Add New
            </button>
        </div>
        <div className="space-y-4">
            <AddressCard address={placeholderAddress} />
            {/* We will map over multiple addresses here later */}
        </div>
    </div>
  );
};

export default Addresses;