'use server'

import { auth } from "@/auth"
import { getUserByAddress, modifyUserSubscription } from "../../lib/User"
import { addSubscriptionPayment } from "../../lib/SubscriptionPayment"
import { getPublicClient } from "../../lib/spender"
import { subscriptionPeriod } from "@/config"

export async function verifyMintSubscription(txHash: `0x${string}`, amount: bigint, type: 'mint' | 'spend-permission', token: string) {
    const session = await auth()
    if(!session || !session.user) {
        return false
    }

    const publicClient = await getPublicClient()

    const [transaction, receipt] = await Promise.all([
        publicClient.getTransaction({ hash: txHash }),
        publicClient.getTransactionReceipt( { hash: txHash }),
    ])

    const txBlock = await publicClient.getBlock({ blockHash: transaction.blockHash })
    console.log({transaction, receiptLogs: receipt.logs})
    const period = subscriptionPeriod

    
    const user = await getUserByAddress(session.user.id as string)

    if(!user) {
        return false
    }

    if (receipt.status !== "success" && user.subscription && txBlock.timestamp <= user.subscription.renewalTimestamp.getTime()) {
        return false
    }

    console.log({amount})

    const subscriptionPayment = await addSubscriptionPayment({
        user,
        type,
        amount,
        token: process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`,
        txHash
    })
    console.log('post add subscription')

    const subscription = {
        renewalTimestamp: subscriptionPayment.createdAt,
        expirationTimestamp: new Date(subscriptionPayment.createdAt.getTime() + period * 24 * 60 * 60 * 1000), // Calculate expiration
        autoRenewal: false,
        amount: BigInt(amount),
        token,
        period: period,
        type
    }

    console.log('pre modify user subscription')
    await modifyUserSubscription(user.id, subscription)
    console.log('post modify user subscription')    
}