import React from 'react';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'Agritech Platform | Market Linkage & Price Discovery (SIH 26132)',
  description: 'Strengthening market linkages and price discovery for farmers, FPOs, and institutional buyers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.className} bg-[#0B132B] text-slate-100 antialiased selection:bg-emerald-500 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
