"use client";
import { Header } from "@/components/core/Header";
import { Footer } from "@/components/core/Footer"; // <-- IMPORT THE NEW FOOTER

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // THE FIX: We have removed the usePathname hook and the conditional logic.
  // The Header will now render on all pages within this layout, including /home.
  return (
    <div>
      <Header />
      {children}
      <Footer /> {/* <-- ADD THE FOOTER HERE */}
    </div>
  );
}