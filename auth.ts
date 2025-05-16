import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { constructAuthMessage } from "./app/api/auth/utils/challenge";
import { getPublicClient } from "./lib/spender";
import { Signature } from "viem";
import prisma from "./lib/dbPrisma";
import { getUserByAddress } from "./lib/User";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import client from "./lib/db";
// import { PrismaClient } from "@prisma/client";

// const prisma = PrismaClient();

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
  // adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
        credentials: {
            signature: {},
            address: {}
        },
        authorize: async (credentials) => {
            let isValidSignature
            try {
            const challengeMessage = 'OnchainWellness wants to connect to your wallet. Please sign this message to continue:'
            const user = await getUserByAddress(credentials.address as string)
            if(!user || !user.challengeHash) {
              return null
            }
            // const user = {challengeHash: 'test'}
            const storedChallenge = constructAuthMessage(challengeMessage, user.challengeHash)

            const publicClient = await getPublicClient()
                isValidSignature = await publicClient.verifyTypedData({
                    ...storedChallenge,
                    address: credentials.address as `0x${string}`,
                    signature: credentials.signature as Signature
                })

            if(!isValidSignature) {
              console.log('invalid signature ')
                return null
            }
            if(user.address !== credentials.address) {
              console.log('invalid address ')
                return null
            }
            return {
                id: credentials.address as string
            }
          }
            catch (error) {
                console.log({error})
                return null
            }
        },
    })
  ],
})