"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShopifyCustomer } from '@/types/shopify';

interface FormInputProps {
  label: string;
  type: string;
  id: string;
  value: string; // Changed to 'value' for controlled components
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({ label, type, id, value, onChange }: FormInputProps) => (
  <div>
    <label htmlFor={id} className="font-sans text-xs uppercase tracking-wider text-white/50">{label}</label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      className="mt-2 w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:border-white/50 transition-colors font-sans"
    />
  </div>
);

interface ProfileDetailsProps {
  customer: ShopifyCustomer | null;
}

const ProfileDetails = ({ customer }: ProfileDetailsProps) => {
  const router = useRouter();
  const [firstName, setFirstName] = useState(customer?.firstName || '');
  const [lastName, setLastName] = useState(customer?.lastName || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const response = await fetch('/api/account/updateProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName }),
    });

    const data = await response.json();

    if (response.ok) {
        setMessage('Profile updated successfully!');
        // Refresh the page to show the new server-rendered data
        router.refresh();
    } else {
        setMessage(`Error: ${data.error}`);
    }
    setIsLoading(false);
  };

  if (!customer) {
    return <div>Loading profile...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      <h2 className="font-display text-3xl font-bold">Profile Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput label="First Name" type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <FormInput label="Last Name" type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
      <FormInput label="Email Address" type="email" id="email" value={customer.email} onChange={() => {}} />
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 bg-white text-black font-sans font-bold uppercase tracking-widest disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      {message && <p className="mt-4 font-sans text-sm">{message}</p>}
    </form>
  );
};

export default ProfileDetails;