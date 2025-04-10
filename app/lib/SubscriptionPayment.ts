import SubscriptionPaymentModel from "../models/SubscriptionPayment";
import dbConnect from "./dbConnect";

export async function getSubscriptionPayments(userId: string) {
    await dbConnect()
    const subscriptionPayments = await SubscriptionPaymentModel.find({
        userId
    })

    return subscriptionPayments
}

export async function addSubscriptionPayment({
    userId,
    type,
    amount,
    txHash
}: {
    userId: string,
    type: 'mint' | 'spend-permission',
    amount: number,
    txHash: string
}) {
    await dbConnect()
    const payment = new SubscriptionPaymentModel({
        userId,
        type,
        amount,
        txHash
    })
    await payment.save()
    return payment
}