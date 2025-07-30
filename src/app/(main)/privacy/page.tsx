// src/app/(main)/privacy/page.tsx
import { PolicyPageLayout } from '@/components/core/PolicyPageLayout';
export default function PrivacyPage() {
  return (
    <PolicyPageLayout title="Privacy Policy">
      <p>Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.</p>
      <h2>Information We Collect</h2>
      <p>We collect information you provide directly to us, such as your name, email address, shipping address, and payment information when you place an order.</p>
      <h2>How We Use Information</h2>
      <p>We use the information we collect to process transactions, send promotional emails (if you opt-in), and improve our services.</p>
    </PolicyPageLayout>
  );
}