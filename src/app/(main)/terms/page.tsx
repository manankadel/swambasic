// src/app/(main)/terms/page.tsx
import { PolicyPageLayout } from '@/components/core/PolicyPageLayout';
export default function TermsPage() {
  return (
    <PolicyPageLayout title="Terms & Conditions">
      <p>Welcome to SWAMBASIC. By accessing our website and purchasing our products, you agree to be bound by these terms and conditions. Please read them carefully.</p>
      <h2>Intellectual Property</h2>
      <p>All content on this site, including text, graphics, logos, and images, is the property of SWAMBASIC and is protected by international copyright laws.</p>
      <h2>Product Use</h2>
      <p>Our products are intended for personal, non-commercial use. Resale of our products is strictly prohibited without prior written consent.</p>
    </PolicyPageLayout>
  );
}