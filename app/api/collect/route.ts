import { NextRequest, NextResponse } from "next/server";
import { getPublicClient, getSpenderWalletClient } from "@/app/lib/spender";
import {
  spendPermissionManagerAbi,
  spendPermissionManagerAddress,
} from "@/app/lib/abi/SpendPermissionManager";
import { desiredChainData } from "@/wagmi";
import { auth } from "@/auth";
import { Subscription } from "@/app/models/User";
import { modifyUserSubscription, getUserByAddress } from "@/app/lib/User";
import { addSubscriptionPayment } from "@/app/lib/SubscriptionPayment";

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
 
    const spendTxnHash = await spenderBundlerClient.writeContract({
      address: spendPermissionManagerAddress,
      abi: spendPermissionManagerAbi,
      functionName: "spend",
      args: [spendPermission, "1"],
    });

    console.log({spendTxnHash})
 
    const spendReceipt = await publicClient.waitForTransactionReceipt({
      hash: spendTxnHash,
    });

    console.log({spendReceipt})

    if (spendReceipt.status === "success") {
      const user = await getUserByAddress(session.user.id as string)
      const subscriptionPayment = await addSubscriptionPayment({
        userId: user,
        type: 'spend-permission',
        amount: spendPermission.allowance,
        token: spendPermission.token,
        txHash: spendTxnHash
      })
      console.log('post add subscription')

      const subscription: Subscription = {
        renewalTimestamp: subscriptionPayment.createdAt,
        autoRenewal: true,
        amount: spendPermission.allowance,
        period: spendPermission.period,
        type: 'spend-permission'
      }

      console.log('pre modify user subscription')
      await modifyUserSubscription(user, subscription)
      console.log('post modify user subscription')
    }
 
    return NextResponse.json({
      status: spendReceipt.status ? "success" : "failure",
      transactionHash: spendReceipt.transactionHash,
      transactionUrl: `${desiredChainData.blockExplorers.default.url}/tx/${spendReceipt.transactionHash}`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}