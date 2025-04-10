import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserByAddress } from "./app/lib/User";
import { constructAuthMessage } from "./app/api/auth/utils/challenge";
import { getPublicClient } from "./app/lib/spender";
import { Signature } from "viem";

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub ?? "";
      return session;
    },
  },
  providers: [
    Credentials({
        credentials: {
            signature: {},
            address: {}
        },
        authorize: async (credentials) => {
            const challengeMessage = 'OnchainWellness wants to connect to your wallet. Please sign this message to continue:'
            const user = await getUserByAddress(credentials.address as string)
            const storedChallenge = constructAuthMessage(challengeMessage, user.challengeHash)

            const publicClient = await getPublicClient()
            let isValidSignature
            try {
                isValidSignature = await publicClient.verifyTypedData({
                    ...storedChallenge,
                    address: credentials.address as `0x${string}`,
                    signature: credentials.signature as Signature
                })
            }
            catch (error) {
                console.log({error})
                return null
            }

            if(!isValidSignature || user.address !== credentials.address) {
                return null
            }
            return {
                id: credentials.address as string
            }
        },
    })
  ],
})