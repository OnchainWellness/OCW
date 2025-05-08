import { formatUnits } from "viem";
import Link from "next/link";
import { desiredChainData } from "@/config";
import { auth } from "@/auth";
import { getUserByAddress } from "@/lib/User";
import { getSubscriptionPayments } from "@/lib/SubscriptionPayment";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import CreateMeetingButton from "@/app/token/[id]/CreateMeetingButton";
import { Prisma } from "@prisma/client";
import SubscribeButton from "@/app/components/SubscribeButton";

export default async function Profile(props: { params: Promise<{ address: string }> }) {
  const params = await props.params;
  const { address } = params;
  const simpleAddress = address.slice(0, 5) + '...' + address.slice(-4);
  const session = await auth()
  const sessionAddress = session?.user?.id
  const isOwner = sessionAddress === address

  const userData = await getUserByAddress(address)
  const userSubscription = getUserSubscription(userData)
  const subscriptionPayments = await getSubscriptionPayments(userData?.id, 0, 10)

  function getUserSubscription(userData: Prisma.UserWhereUniqueInput | null) {
    if(userData && userData.subscription) {
      const periodInMilliseconds = 1000 * (userData.subscription.period as number)
      const renewalTimestamp = (userData.subscription.renewalTimestamp as Date).getTime()
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
      <div className="sm:flex justify-between items-center mb-8">
        <h1 className="text-3xl text-white">{simpleAddress}</h1>
        <div className="flex justify-between">
        <div>
          <p className="text-white text-lg mb-0">Subscription: <span className={userSubscription?.isActive ? 'text-green-500' : 'text-red-500'}>{userSubscription?.isActive ? 'Active' : 'Expired'}</span></p>
          <p className="">
            {userSubscription?.daysLeft ?? 0} day<span className={userSubscription?.daysLeft && userSubscription.daysLeft > 1 ? '' : 'hidden'}>s</span> left
          </p>
        </div>
        {
          session && isOwner && (userSubscription?.isActive ? 
        <div className="flex text-sm sm:text-base justify-center">
          <CreateMeetingButton tokenOwnerAddress={address as `0x${string}`} /> 
        </div> : 
          <div>
            <SubscribeButton />
          </div>
        )
        }
        </div>
      </div>
      { session && isOwner &&
          <div className="tet-right">
          </div>
      }
      <h2 className="text-xl text-white mb-4">Payments:</h2>
      <div style={{overflowY: 'auto'}} className="mb-24">
      <Table>
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
                <TableCell>{formatUnits(payment.amount, 18)}</TableCell>
                <TableCell><Link className="text-white underline" href={`${desiredChainData.blockExplorers.default.url}/tx/${payment.txHash}`} target="_blank" rel="noreferrer">{payment.txHash.slice(0, 12) + '...'}</Link></TableCell>  
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
      </div>
    </main>
  );
}