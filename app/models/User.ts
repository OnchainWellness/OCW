import mongoose from "mongoose";

export interface Subscription {
  renewalTimestamp: Date,
  autoRenewal: boolean,
  amount: number,
  period: number,
  type: 'mint' | 'spend-permission'
}

const SubscriptionSchema = new mongoose.Schema<Subscription>({
  renewalTimestamp: { type: Date, required: true },
  autoRenewal: { type: Boolean, required: true },
  amount: { type: Number, required: true },
  period: { type: Number, required: true },
  type: { type: String, enum: ['mint', 'spend-permission'], required: true },
});

export interface User extends mongoose.Document {
  address: string,
  challengeHash: string,
  subscription: Subscription,
}

/* PetSchema will correspond to a collection in your MongoDB database. */
const UserSchema = new mongoose.Schema<User>({
  address: {
    type: String,
    required: [true, "Please provide a valid Ethereum address."],
    maxlength: [42, "Address cannot be more than 42 characters"],
  },
  challengeHash: {
    type: String,
    required: [true, "Please provide a valid Hash."],
  },
  subscription: {
    type: SubscriptionSchema,
    required: false,
  }
});

export default mongoose.models?.User || mongoose.model<User>("User", UserSchema);