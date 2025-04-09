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
        // // @ts-expect-error bypass
        // keysUrl: 'https://keys-dev.coinbase.com/connect'
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

export const desiredChainData = base
export const BTCB_ADDRESS = '0x0c41F1FC9022FEB69aF6dc666aBfE73C9FFDA7ce'
// export const BTCB_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
export const ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
 
declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof createConfig>;
  }
}