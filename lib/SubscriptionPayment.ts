import { Prisma } from "@prisma/client"
import prisma from "./dbPrisma"
import { Address, Hex } from "viem";
import { getPublicClient, getSpenderWalletClient } from "./spender";
import { spendPermissionManagerAbi, spendPermissionManagerAddress } from "./abi/SpendPermissionManager";
import { getUserByAddress, modifyUserSubscription } from "./User";

export async function collectUserSubscription({
    address,
    token,
    period,
    salt,
    amount
}: {
    address: string,
    token: string,
    salt: bigint,
    period: number,
    amount: bigint
}) {
    const spenderBundlerClient = await getSpenderWalletClient();
    const publicClient = await getPublicClient();

    const spendPermission = {
      account: address as Address, // User wallet address
      spender: process.env.NEXT_PUBLIC_SPENDER_ADDRESS! as Address, // Spender smart contract wallet address
      token: token as Address,
      allowance: amount,
      period , // seconds in a day
      start: 0, // unix timestamp
      end: 281474976710655, // max uint48
      salt: salt,
      extraData: "0x" as Hex,
    };

    const spendTxnHash = await spenderBundlerClient.writeContract({
      address: spendPermissionManagerAddress,
      abi: spendPermissionManagerAbi,
      functionName: "spend",
      args: [spendPermission, "1"],
    });

    console.log({spendTxnHash})
 
    const spendReceipt = await publicClient.waitForTransactionReceipt({
      hash: spendTxnHash,
    });

    console.log({spendReceipt})

    if (spendReceipt.status === "success") {
      const user = await getUserByAddress(address)
      if(!user) {
        return console.log('user does not exist', { status: 500 });
      }

      const subscriptionPayment = await addSubscriptionPayment({
        user,
        type: 'spend-permission',
        amount,
        token,
        txHash: spendTxnHash
      })
      console.log('post add subscription')

      const subscription = {
        renewalTimestamp: subscriptionPayment.createdAt,
        expirationTimestamp: new Date(subscriptionPayment.createdAt.getTime() + spendPermission.period * 1000),
        autoRenewal: true,
        amount: BigInt(amount),
        token,
        period: spendPermission.period,
        type: 'spend-permission'
      }

      console.log('pre modify user subscription')
      await modifyUserSubscription(user.id, subscription)
      console.log('post modify user subscription')
    }
}

export async function getSubscriptionPayments(
    userId: number | null | undefined,
    current: number,
    maxItems: number,
) {
    if(!userId) {
        return {
            payments: [],
            lastpage: 0,
            maxItems: 0
        }
    }
    const toSkip = current * maxItems
    const paymentsCount = await prisma.subscriptionPayment.count({
        where: {
            userId,
        }
        // type
    })

    const payments = await prisma.subscriptionPayment.findMany({
        where: {
            userId,
            // type
        },
        // type
        orderBy: {
            createdAt: 'desc'
        },
        take: maxItems,
        skip: toSkip
    })

    const lastpage = Math.ceil(paymentsCount / maxItems)

    return {
        payments,
        lastpage,
        maxItems,
    }
}

export async function addSubscriptionPayment({
    user,
    type,
    amount,
    token,
    txHash
}: {
    user: Prisma.UserWhereUniqueInput,
    type: string,
    amount: bigint,
    token: string,
    txHash: string
}) {
    const payment = await prisma.subscriptionPayment.create({
        data: {
            user: {
                connect: {
                    id: user.id
                }
            },
            type,
            amount,
            txHash,
            token
        }
    })
    return payment
}