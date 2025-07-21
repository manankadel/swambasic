"use client";
import React from 'react';

// Define the structure of the props for our input component
interface FormInputProps {
  label: string;
  type: string;
  id: string;
  value: string;
}

// Reusable styled input component with correctly typed props
const FormInput = ({ label, type, id, value }: FormInputProps) => (
  <div>
    <label htmlFor={id} className="font-sans text-xs uppercase tracking-wider text-white/50">
      {label}
    </label>
    <input
      type={type}
      id={id}
      defaultValue={value}
      className="mt-2 w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:border-white/50 transition-colors font-sans"
    />
  </div>
);

const ProfileDetails = () => {
  // Placeholder data, to be replaced by Shopify customer data
  const user = {
    firstName: 'Manan',
    lastName: 'Kadel',
    email: 'manankadel@gmail.com'
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="max-w-lg space-y-6">
      <h2 className="font-display text-3xl font-bold">Profile Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput label="First Name" type="text" id="firstName" value={user.firstName} />
        <FormInput label="Last Name" type="text" id="lastName" value={user.lastName} />
      </div>
      <FormInput label="Email Address" type="email" id="email" value={user.email} />
      <div>
        <button
          type="submit"
          className="px-8 py-3 bg-white text-black font-sans font-bold uppercase tracking-widest"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default ProfileDetails;