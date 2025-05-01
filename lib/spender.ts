import { desiredChainData } from "@/config";
import { createPublicClient, createWalletClient, Hex, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
 
export async function getPublicClient() {
  const client = createPublicClient({
    chain: desiredChainData,
    transport: http(),
  });
  return client;
}
 
export async function getSpenderWalletClient() {
  const spenderAccount = privateKeyToAccount(
    process.env.SPENDER_PRIVATE_KEY! as Hex
  );
 
  const spenderWallet = await createWalletClient({
    account: spenderAccount,
    chain: desiredChainData,
    transport: http(),
  });
  return spenderWallet;
}