import { NFT_ABI } from "@/app/utils/abis/NFT";
import { createPublicClient, getContract, http } from "viem";
import btcbIcon from '@/assets/images/BTCB.svg'
import Image from "next/image";
import Link from "next/link";
import { desiredChainData } from "@/wagmi";
import { auth } from "@/auth";
import { getUserByAddress } from "@/app/lib/User";
import { User } from "@/app/models/User";
import { getSubscriptionPayments } from "@/app/lib/SubscriptionPayment";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import CreateMeetingButton from "@/app/token/[id]/CreateMeetingButton";

const publicClient = createPublicClient({
  chain: desiredChainData,
  transport: http(),
})
const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`

type TokenData = {
    tokenId: bigint;
    metadata: string;
}

async function getTokensOwned(id: string) : Promise<TokenData[]> {
  try {
    const contract = getContract({ address: contractAddress, abi: NFT_ABI, client: publicClient })
    const tokenData = await contract.read.getNftsOwned([id])
    return tokenData as TokenData[]
  } catch (error) {
    console.log({error})
   return [] 
  }
}

export default async function Profile(props: { params: Promise<{ address: string }> }) {
  const params = await props.params;
  const { address } = params;
  const tokensOwned = await getTokensOwned(address);
  const simpleAddress = address.slice(0, 5) + '...' + address.slice(-4);
  const session = await auth()
  const sessionAddress = session?.user?.id
  const isOwner = sessionAddress === address

  const parsedTokens = tokensOwned.map((tokenData) => {
    return {
      ...tokenData,
      metadata: {
        image: btcbIcon,
      },
    };
  });

  const userData = await getUserByAddress(address)
  const userSubscription = getUserSubscription(userData)
  const subscriptionPayments = await getSubscriptionPayments(userData?.id, 0, 10)

  function getUserSubscription(userData: User | null) {
    if(userData && userData.subscription) {
      const periodInMilliseconds = userData.subscription.period * 1000
      const renewalTimestamp = userData.subscription.renewalTimestamp.getTime()
      const isActive = renewalTimestamp + periodInMilliseconds > Date.now()
      const expirationDate = new Date(renewalTimestamp + periodInMilliseconds)
      const daysLeft = Math.ceil((expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) 

      return {
        isActive,
        expirationDate,
        autoRenewal: userData.subscription.autoRenewal,
        daysLeft
      }
    }

    return null
  }

  return (
    <main className="mt-14 p-5 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-white">{simpleAddress}</h1>
          <p className="text-white mb-1">Subscription: <span className={userSubscription?.isActive ? 'text-green-500' : 'text-red-500'}>{userSubscription?.isActive ? 'Active' : 'Expired'}</span></p>
          <p className="">
            {userSubscription?.daysLeft} day<span className={userSubscription?.daysLeft && userSubscription.daysLeft > 1 ? '' : 'hidden'}>s</span> left
          </p>
        {
          session && isOwner &&
        (<div>
          <CreateMeetingButton tokenOwnerAddress={address as `0x${string}`} /> 
        </div>)
        }
      </div>
      { session && isOwner &&
          <div className="tet-right">
          </div>
      }
      <h2 className="text-xl text-white mb-4">Payments:</h2>
      <Table className="mb-24">
        <TableHead className="text-white bg-gray-800 dark:bg-gray-200 rounded-none">
          <TableRow className="bg-gray-800">
            <TableHeadCell>Date</TableHeadCell>
            <TableHeadCell>Type</TableHeadCell>
            <TableHeadCell>Amount</TableHeadCell>
            <TableHeadCell>Transaction</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="bg-gray-800 text-whit">
          {
            subscriptionPayments.payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{payment.type}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell><Link className="text-white underline" href={`${desiredChainData.blockExplorers.default.url}/tx/${payment.txHash}`} target="_blank" rel="noreferrer">{payment.txHash.slice(0, 12) + '...'}</Link></TableCell>  
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </main>
  );
}