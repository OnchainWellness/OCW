import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains'; // add baseSepolia for testing 
import { coinbaseWallet, metaMask } from 'wagmi/connectors';
 
export const wagmiConfig =  createConfig({
    chains: [base, baseSepolia], // add baseSepolia for testing 
    connectors: [
      coinbaseWallet({
        appName: 'OnchainWellness',
        preference: 'all',
        version: '4',
      }),
      metaMask(),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
        [base.id]: http(),
        [baseSepolia.id]: http(), // add baseSepolia for testing
    },
  });

  export const desiredChainData = baseSepolia
 
declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof createConfig>;
  }
}