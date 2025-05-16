import { Token } from "@coinbase/onchainkit/token"
import { base, baseSepolia } from "viem/chains"

// export const desiredChainData = process.env.NODE_ENV === 'development' ? baseSepolia : base
export const desiredChainName = process.env.NEXT_PUBLIC_ETHEREUM_NETWORK
export const desiredChainData = desiredChainName  === 'base' ? base : baseSepolia

// export const BTCB_ADDRESS = '0x0c41F1FC9022FEB69aF6dc666aBfE73C9FFDA7ce' // for production (BTCB)
export const BTCB_ADDRESS = process.env.NEXT_PUBLIC_ERC20_TOKEN as `0x${string}}` // for testing (Personal Token)
export const ETH_ADDRESS ="0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

interface ContractInfo {
    NFT: {address: `0x${string}`}
    ERC20: {address: `0x${string}`}
}

export const contracts : {
    base: ContractInfo,
    baseSepolia: ContractInfo
} = {
    "base": {
        NFT: {
            address: '0x590E6336617D4B5AfB6d3F85508EE9b4985350C6'
        },
        ERC20: {
            address: '0x0c41F1FC9022FEB69aF6dc666aBfE73C9FFDA7ce'
        }
    },
    "baseSepolia": {
        NFT: {
            address: '0x91Ba299F3D22e85602F0B221cF16ee703d1ed5BA'
        },
        ERC20: {
            address: '0xF6F6bcF20bdACB2502B6e209bE828F76fb421129'
        }
    }
}

export const contractsUsed = contracts[desiredChainName as 'base' | 'baseSepolia']

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
    address: contracts[desiredChainName as 'base' | 'baseSepolia'].ERC20.address,
    symbol: 'BTCB',
    decimals: 18,
    image: '/Bitcoin-on-Base-Logo.png',
    chainId: 8453,
    },
]

export const subscriptionPeriod = 60 * 60 * 24 * 30 // 30 days