'use server'
import { createHmac, randomUUID } from "node:crypto";
const secret = randomUUID()
import { recoverTypedSignature, SignTypedDataVersion } from '@metamask/eth-sig-util';
import { cookies } from "next/headers";
import { AuthMessage, constructAuthMessage, myCache } from "../api/auth/utils/challenge";
import { createUser, getUserByAddress, updateUserChallenge } from "../lib/User";



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
    await updateUserChallenge(user, hash)
  }
  return challenge
}

export async function verifySignature(signature: string, claimedAddress: `0x${string}`) {
    if(!claimedAddress) 
        return
    const challengeMessage = 'OnchainWellness wants to connect to your wallet. Please sign this message to continue:'
    const cookieStore = await cookies()
    const hash = myCache.get(claimedAddress) as string
    const storedChallenge = constructAuthMessage(challengeMessage, hash)
    const recovered = recoverTypedSignature({
        data: storedChallenge,
        signature,
        version: SignTypedDataVersion.V4
    })
    console.log({recovered})
    console.log({hash, signature})

    myCache.del(claimedAddress)
    if(recovered.toLowerCase() === claimedAddress.toLowerCase()) {
        cookieStore.set({
            name: 'wallet',
            value: recovered.toLowerCase(),
            httpOnly: true,
        })
        return true
    }

  return false
}