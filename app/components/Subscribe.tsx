"use client";
import { cn, color, text } from "@coinbase/onchainkit/theme";
import { useEffect, useState } from "react";
import {
  useAccount,
  useChainId,
  useConnect,
  useConnectors,
  useSignTypedData,
} from "wagmi";
import { Address, Hex } from "viem";
import { useQuery } from "@tanstack/react-query";
import { spendPermissionManagerAddress } from "@/lib/abi/SpendPermissionManager";
import { desiredChainData, subscriptionPeriod } from "@/config";
import BlockButton from "./BlockButton/BlockButton";
import { switchChain } from "wagmi/actions";
import { Token } from "@coinbase/onchainkit/token";
import { getRandomInt, getSubscriptionPrice } from "../actions/token";
import { useRouter } from "next/navigation";
import { wagmiConfig } from "@/wagmi";

interface SubscribeParams {
  token: Token | undefined
}
 
export default function Subscribe({token}: SubscribeParams) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [signature, setSignature] = useState<Hex>();
  const [transactions, setTransactions] = useState<Hex[]>([]);
  const [spendPermission, setSpendPermission] = useState<object>();
 
  const { signTypedDataAsync } = useSignTypedData();
  const account = useAccount();
  const chainId = useChainId();
  const { connectAsync } = useConnect();
  const connectors = useConnectors();
  const router = useRouter();
 
  const { data, isSuccess } = useQuery({
    queryKey: ["collectSubscription"],
    queryFn: handleCollectSubscription,
    refetchOnWindowFocus: false,
    enabled: !!signature,
  });
 
  async function handleSubmit() {
    setIsDisabled(true);
    let accountAddress = account?.address;
    if (!accountAddress) {
      try {
        const requestAccounts = await connectAsync({
          connector: connectors[0],
        });
        accountAddress = requestAccounts.accounts[0];
      } catch {
        return;
      }
    }

    const spendPermission = {
      account: accountAddress as Address, // User wallet address
      spender: process.env.NEXT_PUBLIC_SPENDER_ADDRESS! as Address, // Spender smart contract wallet address
      token: token?.address as Address,
      allowance: await getSubscriptionPrice(token?.address || ""),
      period: subscriptionPeriod, // seconds in a day
      start: 0, // unix timestamp
      end: 281474976710655, // max uint48
      salt: BigInt(await getRandomInt()),
      extraData: "0x" as Hex,
    };
 
    try {
      const signature = await signTypedDataAsync({
        domain: {
          name: "Spend Permission Manager",
          version: "1",
          chainId: chainId,
          verifyingContract: spendPermissionManagerAddress,
        },
        types: {
          SpendPermission: [
            { name: "account", type: "address" },
            { name: "spender", type: "address" },
            { name: "token", type: "address" },
            { name: "allowance", type: "uint160" },
            { name: "period", type: "uint48" },
            { name: "start", type: "uint48" },
            { name: "end", type: "uint48" },
            { name: "salt", type: "uint256" },
            { name: "extraData", type: "bytes" },
          ],
        },
        primaryType: "SpendPermission",
        // @ts-expect-error bypass
        message: spendPermission,
      });
      setSpendPermission(spendPermission);
      setSignature(signature);
    } catch (e) {
      console.error(e);
    }
    setIsDisabled(false);
  }
 
  async function handleCollectSubscription() {
    setIsDisabled(true);
    let data;
    try {
      const replacer = (key: string, value: unknown) => {
        if (typeof value === "bigint") {
          return value.toString();
        }
        return value;
      };
      const response = await fetch("/api/collect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            spendPermission,
            signature,
            dummyData: Math.ceil(Math.random() * 100),
          },
          replacer
        ),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      data = await response.json();
    } catch (e) {
      console.error(e);
    }
    setIsDisabled(false);
    return data;
  }
 
  useEffect(() => {
    if (!data) return;
    setTransactions([data?.transactionHash, ...transactions]);
  }, [data]);

  console.log({chainId})
  console.log('Hola')
 
  return (
    <div>
      {!signature && !isSuccess ? (
        <div className="flex">
            {chainId !== desiredChainData.id ? 
            <BlockButton onClick={()=> switchChain(wagmiConfig, {chainId: desiredChainData.id})}>
                Switch to Base
            </BlockButton> :

          <BlockButton
            onClick={handleSubmit}
            type="button"
            disabled={isDisabled || !token}
            data-testid="ockTransactionButton_Button"
          >
            <span
              className={cn(
                text.headline,
                color.inverse,
                "flex justify-center"
              )}
            >
              {!token ? 'Select a token' : 'Subscribe'}
            </span>
          </BlockButton>
        }
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex">
            <BlockButton
              onClick={() => {
                router.push("/profile/" + account?.address)
              }}
              type="button"
              disabled={isDisabled}
              data-testid="redirectToProfileButton_Button"
            >
              <span
                className={cn(
                  text.headline,
                  color.inverse,
                  "flex justify-center"
                )}
              >
               View Subscription
              </span>
            </BlockButton>
          </div>
        </div>
      )}
    </div>
  );
}