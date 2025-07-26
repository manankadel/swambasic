"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// THE FIX: We now import BOTH types from the centralized `types` file.
import { ShopifyAddress, NewAddressInput } from "@/types/shopify";

// AddressCard component remains the same
const AddressCard = ({ address }: { address: ShopifyAddress }) => (
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

interface AddressFormProps {
    onCancel: () => void;
    onFormSubmit: (addressData: NewAddressInput) => void;
}

const AddressForm = ({ onCancel, onFormSubmit }: AddressFormProps) => {
    // ... all the state and JSX for this component remains the same
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [country, setCountry] = useState('');
    const [zip, setZip] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFormSubmit({ address1, address2, city, province, country, zip });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 border border-white/10 rounded-lg">
            {/* ... form inputs ... */}
        </form>
    );
}

interface AddressesProps {
  addresses: ShopifyAddress[];
}

const Addresses = ({ addresses }: AddressesProps) => {
  // ... all the logic and JSX for this main component remains the same
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  const handleAddNewAddress = async (addressData: NewAddressInput) => {
    setError('');
    const response = await fetch('/api/account/addAddress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData),
    });

    if (response.ok) {
        setIsAdding(false);
        router.refresh();
    } else {
        const result = await response.json();
        setError(result.error || 'Failed to add address.');
    }
  };

  return (
    <div className="max-w-lg space-y-8">
        {/* ... component JSX ... */}
    </div>
  );
};

export default Addresses;