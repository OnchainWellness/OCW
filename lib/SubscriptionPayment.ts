import { Prisma } from "@prisma/client"
import prisma from "./dbPrisma"

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
    amount: number,
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