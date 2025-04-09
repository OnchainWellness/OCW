'use server'

import { BTCB_ADDRESS, ETH_ADDRESS } from "@/wagmi";
import { parseUnits } from "viem";

const pricesDict = {
    [BTCB_ADDRESS.toLowerCase()]: parseUnits('5', 1),
    [ETH_ADDRESS.toLowerCase()]: parseUnits('8', 1), 
}


export async function getSubscriptionPrice(tokenAddress: string | undefined) {
    if (!tokenAddress) {
        return parseUnits('0', 1)
    }
    const price = pricesDict[tokenAddress.toLowerCase()]
    return price
}