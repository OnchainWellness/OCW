import SubscriptionPaymentModel, { SubscriptionPayment } from "../models/SubscriptionPayment";
import dbConnect from "./dbConnect";

export async function getSubscriptionPayments(
    userId: string,
    current: number,
    maxItems: number,
    type: 'mint' | 'spend-permission' | undefined = undefined
) {
    await dbConnect()
    const toSkip = current * maxItems
    const paymentsCount = await SubscriptionPaymentModel.find({
        userId,
        // type
    })
        .countDocuments()

    const payments = await SubscriptionPaymentModel.find({
        userId,
        // type
    })
        .sort({ createdAt: -1 })
        .limit(maxItems)
        .skip(toSkip)

    const lastpage = Math.ceil(paymentsCount / maxItems)

    return {
        payments,
        lastpage,
        maxItems,
    }
}

export async function addSubscriptionPayment({
    userId,
    type,
    amount,
    token,
    txHash
}: SubscriptionPayment) {
    await dbConnect()
    const payment = new SubscriptionPaymentModel({
        userId,
        type,
        amount,
        txHash,
        token
    })
    await payment.save()
    return payment
}