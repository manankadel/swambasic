// src/app/(main)/refunds/page.tsx
import { PolicyPageLayout } from '@/components/core/PolicyPageLayout';
export default function RefundsPage() {
  return (
    <PolicyPageLayout title="Cancellations & Refunds">
      <h2>Cancellations</h2>
      <p>You may request a cancellation within 24 hours of purchase, provided your order has not yet been shipped. Please contact us immediately at [support@swambasic.com].</p>
      <h2>Returns & Refunds</h2>
      <p>We accept returns on unworn, unwashed items with original tags attached within 14 days of delivery. To initiate a return, please contact our support team. Once we receive and inspect the item, a refund will be processed to your original payment method.</p>
      <p>Please note that shipping fees are non-refundable.</p>
    </PolicyPageLayout>
  );
}