'use server'

import { BTCB_ADDRESS, contractsUsed, ETH_ADDRESS } from "@/config";
import { randomInt } from "node:crypto";
import { parseUnits } from "viem";
import { getPublicClient } from "../../lib/spender";
import { NFT_ABI } from "../utils/abis/NFT";

const publicClient = await getPublicClient()

const mintPrice = await publicClient.readContract({
    address: contractsUsed.NFT.address,
    abi: NFT_ABI,
    functionName: 'mintPrice',
    args: []
}) as string

const mintPriceErc20 = await publicClient.readContract({
    address: contractsUsed.NFT.address,
    abi: NFT_ABI,
    functionName: 'mintPriceErc20',
    args: []
}) as string

// const pricesDict = {
//     [BTCB_ADDRESS.toLowerCase()]: parseUnits('5', 1),
//     [ETH_ADDRESS.toLowerCase()]: parseUnits('8', 1), 
// }

const pricesDict = {
    [BTCB_ADDRESS.toLowerCase()]: mintPriceErc20,
    [ETH_ADDRESS.toLowerCase()]: mintPrice
}

export async function getRandomInt() {
    return randomInt(10, 100000)
}

export async function getSubscriptionPrice(tokenAddress: string | undefined) {
    if (!tokenAddress) {
        return parseUnits('0', 1)
    }
    const price = pricesDict[tokenAddress.toLowerCase()]
    return price
}