import '@coinbase/onchainkit/styles.css';
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Plus_Jakarta_Sans } from 'next/font/google'
import Footer from './components/Footer/Footer';
import Header from './components/Header';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: '400',
})

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
  description: 'Generated by `create-onchain`, a Next.js template for OnchainKit',
  icons: {
    icon: '/favicon.ico',
  }, 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body className={'text-stone-500 bg-black ' + plusJakartaSans.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
      <Footer />
      </body>
    </html>
  );
}
