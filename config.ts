import { Token } from "@coinbase/onchainkit/token"
import { base } from "viem/chains"

export const desiredChainData = base
// export const BTCB_ADDRESS = '0x0c41F1FC9022FEB69aF6dc666aBfE73C9FFDA7ce' // for production (BTCB)
export const BTCB_ADDRESS = '0xF6F6bcF20bdACB2502B6e209bE828F76fb421129' // for testing (Personal Token)
export const ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

export const tokensOptions: Token[] = [{
    name: 'Ethereum',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'ETH',
    decimals: 18,
    image: 'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
    chainId: 8453,
    },
    {
    name: 'BTCB',
    address: BTCB_ADDRESS,
    symbol: 'BTCB',
    decimals: 18,
    image:
        'https://btconbase.org/wp-content/uploads/2024/08/BTCB-Logo-1.png',
    chainId: 8453,
    },
]

export const subscriptionPeriod = 60 * 60 * 24 * 30 // 30 days