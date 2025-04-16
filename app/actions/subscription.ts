'use server'

import { auth } from "@/auth"
import { getUserByAddress, modifyUserSubscription } from "../lib/User"
import { addSubscriptionPayment } from "../lib/SubscriptionPayment"
import { Subscription } from "../models/User"
import { getPublicClient } from "../lib/spender"

export async function verifyMintSubscription(txHash: `0x${string}`, amount: number, type: 'mint' | 'spend-permission') {
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
    const period = 86400

    
    const user = await getUserByAddress(session.user.id as string)

    if(!user) {
        return false
    }

    if (receipt.status !== "success" && user.subscription && txBlock.timestamp <= user.subscription.renewalTimestamp.getTime()) {
        return false
    }

    console.log({amount})

    const subscriptionPayment = await addSubscriptionPayment({
        // @ts-expect-error bypass
        userId: user,
        type,
        amount,
        token: process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`,
        txHash
    })
    console.log('post add subscription')

    const subscription: Subscription = {
        renewalTimestamp: subscriptionPayment.createdAt,
        autoRenewal: true,
        amount,
        period: period,
        type
    }

    console.log('pre modify user subscription')
    await modifyUserSubscription(user, subscription)
    console.log('post modify user subscription')    
}