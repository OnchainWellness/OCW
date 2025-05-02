'use server'

import { BTCB_ADDRESS, ETH_ADDRESS } from "@/config";
import { randomInt } from "node:crypto";
import { parseUnits } from "viem";
import { getPublicClient } from "../../lib/spender";
import { NFT_ABI } from "../utils/abis/NFT";

const publicClient = await getPublicClient()

export async function getSubscriptionPrice(tokenAddress: string | undefined) {
    if (!tokenAddress) {
        return parseUnits('0', 1)
    }

    const [mintPrice, mintPriceErc20] = await Promise.all([publicClient.readContract({
        address: process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`,
        abi: NFT_ABI,
        functionName: 'mintPrice',
        args: []
    })
    , publicClient.readContract({
        address: process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`,
        abi: NFT_ABI,
        functionName: 'mintPriceErc20',
        args: []
    })])

    console.log({mintPrice, mintPriceErc20})

    const pricesDict = {
        [BTCB_ADDRESS.toLowerCase()]: mintPriceErc20,
        [ETH_ADDRESS.toLowerCase()]: mintPrice
    }

    const price = pricesDict[tokenAddress.toLowerCase()]
    return price
}

export async function getRandomInt() {
    return randomInt(10, 100000)
}
