import prisma from "./dbPrisma";

export async function getUserByAddress(address: string) {
    const user = await prisma.user.findFirst({
        where: {
            address
        },
        include: {
            subscription: true
        }
    })

    return user
}

export async function createUser({
    address,
    challengeHash,
}: {
    address: string,
    challengeHash: string
}) {
    let user = await getUserByAddress(address)
    if(user) {
        return user
    }
    user = await prisma.user.create({
        data: {
            address,
            challengeHash
        }, 
        include: {
            subscription: true
        }
    })
    return user
}

export async function updateUserChallenge(userAddress: string, challengeHash: string) {
    await prisma.user.update({
        where: {
            address: userAddress
        },
        data: {
            challengeHash
        }
    })
}

export async function getUserSubscriptions(address: string) {
    const user = await prisma.user.findFirst({
        where: {
            address
        },
        include: {
            subscription: true
        }
    })

    return [user?.subscription]
}

export async function modifyUserSubscription(userId: number, subscription: {
    renewalTimestamp: Date,
    autoRenewal: boolean,
    amount: bigint,
    period: number,
    type: string
}) {
    await prisma.subscription.upsert({
        where: {
            userId
        },
        update: subscription,
        create: {
            userId,
            ...subscription
        }
    })
}