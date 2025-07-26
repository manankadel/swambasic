"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShopifyAddress } from "@/types/shopify";
import { NewAddressInput } from "@/lib/shopify";

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
            <input type="text" placeholder="Address 1" value={address1} onChange={e => setAddress1(e.target.value)} required className="w-full bg-white/5 p-2 rounded-md font-sans" />
            <input type="text" placeholder="Address 2 (Optional)" value={address2} onChange={e => setAddress2(e.target.value)} className="w-full bg-white/5 p-2 rounded-md font-sans" />
            <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} required className="w-full bg-white/5 p-2 rounded-md font-sans" />
                <input type="text" placeholder="State / Province" value={province} onChange={e => setProvince(e.target.value)} required className="w-full bg-white/5 p-2 rounded-md font-sans" />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="ZIP / Postal Code" value={zip} onChange={e => setZip(e.target.value)} required className="w-full bg-white/5 p-2 rounded-md font-sans" />
                <input type="text" placeholder="Country" value={country} onChange={e => setCountry(e.target.value)} required className="w-full bg-white/5 p-2 rounded-md font-sans" />
            </div>
            <div className="flex gap-4 mt-4">
                <button type="submit" className="px-6 py-2 bg-white text-black text-xs font-sans uppercase tracking-wider">Save Address</button>
                <button type="button" onClick={onCancel} className="px-6 py-2 border border-white/50 text-xs font-sans uppercase tracking-wider">Cancel</button>
            </div>
        </form>
    );
}

interface AddressesProps {
  addresses: ShopifyAddress[];
}

const Addresses = ({ addresses }: AddressesProps) => {
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
        <div className="flex justify-between items-center">
            <h2 className="font-display text-3xl font-bold">Your Addresses</h2>
            {!isAdding && (
                <button 
                    onClick={() => setIsAdding(true)} 
                    className="px-6 py-2 border border-white/50 text-xs font-sans uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                >
                    Add New
                </button>
            )}
        </div>
        
        {error && <p className="font-sans text-red-400">{error}</p>}

        {isAdding && (
            <AddressForm 
                onCancel={() => setIsAdding(false)} 
                onFormSubmit={handleAddNewAddress} 
            />
        )}
        
        <div className="space-y-4">
            {addresses.length > 0 ? (
              addresses.map(address => <AddressCard key={address.id} address={address} />)
            ) : (
              !isAdding && <p className="font-sans text-white/50">You have no saved addresses.</p>
            )}
        </div>
    </div>
  );
};

export default Addresses;