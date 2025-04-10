import mongoose from "mongoose";

export interface User extends mongoose.Document {
  address: string,
  challengeHash: string
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
    required: [true, "Please provide a valid Ethereum address."],
  },
});

export default mongoose.models?.User || mongoose.model<User>("User", UserSchema);