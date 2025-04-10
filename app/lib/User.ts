import UserModel, { User } from "../models/User";
import dbConnect from "./dbConnect";

export async function getUserByAddress(address: string) {
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