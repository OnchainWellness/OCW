'use server'
import { createHmac, randomUUID } from "node:crypto";
const secret = randomUUID()
import { AuthMessage, constructAuthMessage } from "../api/auth/utils/challenge";
import { createUser, getUserByAddress, updateUserChallenge } from "../../lib/User";



export async function generateChallenge(address: `0x${string}`): Promise<AuthMessage> {
  const challengeMessage = 'OnchainWellness wants to connect to your wallet. Please sign this message to continue:'
    const hash = createHmac('sha256', secret)
    .update(address + randomUUID())
    .digest('hex');

  const challenge = constructAuthMessage(challengeMessage, hash)

  let user = await getUserByAddress(address)
  if(!user) {
    user = await createUser({
        address,
        challengeHash: hash
    })
  } else{
    await updateUserChallenge(address, hash)
  }
  return challenge
}