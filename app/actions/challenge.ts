'use server'
import NodeCache from "node-cache";
import { createHmac, randomUUID } from "node:crypto";
const myCache = new NodeCache();
const secret = randomUUID()
import { recoverTypedSignature, SignTypedDataVersion } from '@metamask/eth-sig-util';
import { cookies } from "next/headers";


export type AuthMessage = {
    types: {
        EIP712Domain: { name: string; type: string }[];
        Challenge: { name: string; type: string }[];
    };
    primaryType: "Challenge";
    domain: { name: string; version: string };
    message: { description: string; challenge: string };
};

function constructAuthMessage(description: string, challenge: string): AuthMessage {
    return {
        types: {
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' }
            ],
            Challenge: [
                { name: 'challenge', type: 'string' },
                { name: 'description', type: 'string' }
            ]
        },
        primaryType: "Challenge" as const,
        domain: {
            name: 'OnchainWellness',
            version: '1',
        },
        message: {
            description,
            challenge
        }
    };
}

export async function generateChallenge(address: `0x${string}`): Promise<AuthMessage> {

  const challengeMessage = 'OnchainWellness wants to connect to your wallet. Please sign this message to continue:'
    const hash = createHmac('sha256', secret)
    .update(address + randomUUID())
    .digest('hex');

  const challenge = constructAuthMessage(challengeMessage, hash)

  myCache.set(address, hash , 10000)
  myCache.set(hash, challengeMessage, 10000)
  console.log({hash, address})
  

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