'use client';

import { useState, type ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '@/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function Providers(props: { children: ReactNode }) {
  const [config] = useState(() => wagmiConfig);
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient} >
        {props.children}
       </QueryClientProvider>
     </WagmiProvider>
  );
}

