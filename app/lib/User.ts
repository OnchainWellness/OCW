import UserModel, { Subscription, User } from "../models/User";
import dbConnect from "./dbConnect";

export async function getUserByAddress(address: string): Promise<User | null> {
    await dbConnect()
    const user = await UserModel.findOne({
        address
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
    await dbConnect()
    let user = await getUserByAddress(address)
    if(user) {
        return user
    }
    user = await UserModel.create({
        address,
        challengeHash
    })
    return user
}

export async function updateUserChallenge(user: User, challengeHash: string) {
    await dbConnect()
    user.challengeHash = challengeHash
    await user.save()
}

export async function getUserSubscriptions(address: string) {
    await dbConnect()
    const user = await UserModel.findOne({
        address
    })

    return user?.subscriptions
}

export async function modifyUserSubscription(user: User, subscription: Subscription) {
    await dbConnect()
    const newUser = await UserModel.updateOne({ address: user.address }, { $set: { subscription: subscription } })
    console.log({newUser})

    return newUser
}