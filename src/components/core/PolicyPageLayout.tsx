// src/components/core/PolicyPageLayout.tsx

import React from 'react';

interface PolicyPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const PolicyPageLayout = ({ title, children }: PolicyPageLayoutProps) => {
  return (
    <main className="min-h-screen bg-black pt-40 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-12 border-b border-white/10 pb-6">
          {title}
        </h1>
        {/* The 'prose' classes automatically style the text for readability */}
        <div className="prose prose-invert prose-lg max-w-none font-sans text-white/70 prose-headings:text-white prose-headings:font-display">
          {children}
        </div>
      </div>
    </main>
  );
};