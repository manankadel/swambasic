// src/app/(main)/shipping/page.tsx
import { PolicyPageLayout } from '@/components/core/PolicyPageLayout';
export default function ShippingPage() {
  return (
    <PolicyPageLayout title="Shipping Policy">
      <h2>Processing Time</h2>
      <p>Orders are processed within 1-3 business days. During peak seasons, processing times may be extended.</p>
      <h2>Domestic & International Shipping</h2>
      <p>We offer standard and expedited shipping options for both domestic and international orders. Shipping rates are calculated at checkout based on your location and selected service.</p>
      <h2>Tracking</h2>
      <p>Once your order has shipped, you will receive an email notification with a tracking number.</p>
    </PolicyPageLayout>
  );
}