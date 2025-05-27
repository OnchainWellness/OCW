import { NextRequest, NextResponse } from "next/server";
import { getPublicClient, getSpenderWalletClient } from "@/lib/spender";
import {
  spendPermissionManagerAbi,
  spendPermissionManagerAddress,
} from "@/lib/abi/SpendPermissionManager";
import { desiredChainData } from "@/config";
import { auth } from "@/auth";
import { modifyUserSubscription, getUserByAddress } from "@/lib/User";
import { addSubscriptionPayment } from "@/lib/SubscriptionPayment";

export async function POST(request: NextRequest) {
  const session = await auth()

  console.log({session})

  if(!session || !session.user) {
    return NextResponse.json({}, { status: 401 });
  }

  const spenderBundlerClient = await getSpenderWalletClient();
  const publicClient = await getPublicClient();
  try {
    const body = await request.json();
    const { spendPermission, signature } = body;
 
    const approvalTxnHash = await spenderBundlerClient.writeContract({
      address: spendPermissionManagerAddress,
      abi: spendPermissionManagerAbi,
      functionName: "approveWithSignature",
      args: [spendPermission, signature],
    });
    console.log({approvalTxnHash})
    const approvalReceived = await publicClient.waitForTransactionReceipt({
      hash: approvalTxnHash,
    });

    console.log({approvalReceived})
    
    let spendTxnHash: `0x${string}`

    try {
      spendTxnHash = await spenderBundlerClient.writeContract({
      address: spendPermissionManagerAddress,
      abi: spendPermissionManagerAbi,
      functionName: "spend",
      args: [spendPermission, "1"],
    });
    } catch (error) {
      // @ts-expect-error bypass
      throw new Error(error?.cause?.reason)     
    }

    console.log({spendTxnHash})
 
    const spendReceipt = await publicClient.waitForTransactionReceipt({
      hash: spendTxnHash,
    });

    console.log({spendReceipt})

    if (spendReceipt.status === "success") {
      const user = await getUserByAddress(session.user.id as string)
      if(!user) {
        return NextResponse.json({}, { status: 500 });
      }

      const subscriptionPayment = await addSubscriptionPayment({
        user,
        type: 'spend-permission',
        amount: spendPermission.allowance,
        token: spendPermission.token,
        txHash: spendTxnHash
      })
      console.log('post add subscription')

      const subscription = {
        renewalTimestamp: subscriptionPayment.createdAt,
        expirationTimestamp: new Date(Number(subscriptionPayment.createdAt) + Number(spendPermission.period) * 1000),
        autoRenewal: true,
        amount: BigInt(spendPermission.allowance),
        token: spendPermission.token,
        period: spendPermission.period,
        salt: spendPermission.salt,
        type: 'spend-permission'
      }

      console.log('pre modify user subscription')
      await modifyUserSubscription(user.id, subscription)
      console.log('post modify user subscription')
    }
 
    return NextResponse.json({
      status: spendReceipt.status ? "success" : "failure",
      transactionHash: spendReceipt.transactionHash,
      transactionUrl: `${desiredChainData.blockExplorers.default.url}/tx/${spendReceipt.transactionHash}`,
    });
  } catch (error) {
    console.error({error});
    // @ts-expect-error bypass
    return NextResponse.json({error: error?.message}, { status: 500 });
  }
}