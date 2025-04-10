'use client';

import { useState, type ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '@/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'viem/chains';
import { SessionProvider } from 'next-auth/react';

export function Providers(props: { children: ReactNode }) {
  const [config] = useState(() => wagmiConfig);
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config}>
      <SessionProvider>
      <QueryClientProvider client={queryClient} >
        <OnchainKitProvider 
          chain={base}
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        >
          {props.children}
        </OnchainKitProvider>
       </QueryClientProvider>
      </SessionProvider>
     </WagmiProvider>
  );
}

