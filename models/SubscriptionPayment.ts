import mongoose from "mongoose";

export interface SubscriptionPayment extends mongoose.Document {
    userId: mongoose.Types.ObjectId,
    type: 'mint' | 'spend-permission',
    amount: number,
    txHash: string,
    token: string,
}


/* PetSchema will correspond to a collection in your MongoDB database. */
const SubscriptionPaymentSchema = new mongoose.Schema<SubscriptionPayment>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide a valid UserId."],
    },
    type: {
        type: String,
        required: [true, "Please provide a valid Payment type."],
    },
    amount: {
        type: Number,
        required: [true, "Please provide a valid amount."],
    },
    txHash: {
        type: String,
        required: [true, "Please provide a valid transaction hash."],
    },
    token: {
        type: String,
        required: [true, "Please provide a valid token address."],
    },
}, {
    timestamps: true
});

export default mongoose.models?.SubscriptionPayment || mongoose.model<SubscriptionPayment>("SubscriptionPayment", SubscriptionPaymentSchema);