import { NFT_ABI } from "@/app/utils/abis/NFT";
import { createPublicClient, getContract, http } from "viem";
import btcbIcon from '@/assets/images/BTCB.svg'
import Image from "next/image";
import { atob } from "node:buffer";
import Link from "next/link";
import { desiredChainData } from "@/wagmi";

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
    const contract = getContract({ address: contractAddress, abi: NFT_ABI, client: publicClient })
    const tokenData:TokenData[] = await contract.read.getNftsOwned([id]) as TokenData[]
    return tokenData
}

export default async function Profile(props: { params: Promise<{ address: string }> }) {
  const params = await props.params;
  const { address } = params;
  const tokensOwned = await getTokensOwned(address);
  const simpleAddress = address.slice(0, 5) + '...' + address.slice(-4);

  const parsedTokens = tokensOwned.map((tokenData) => {
    const metadata = JSON.parse(atob(tokenData.metadata.split(',')[1]));
    return {
      ...tokenData,
      metadata: {
        ...metadata,
        image: atob(metadata.image.split(',')[1]),
      },
    };
  });

  console.log('Parsed tokens:', parsedTokens);


  return (
    <main className="p-5 max-w-[1200px] mx-auto">
      <h1 className="text-3xl text-white mb-8">{simpleAddress}</h1>

      <h2 className="text-xl text-white mb-2">Collection:</h2>
      {
        tokensOwned.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 px-4 pb-16">
            {parsedTokens.map((tokenData) => (
              <Link 
                href={'/token/' + String(tokenData.tokenId)} 
                key={tokenData.tokenId} 
                className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out"
              >
                <Image src={btcbIcon} alt="NFT" className="w-24 h-24 mb-3" />
                <p className="text-white">{String(tokenData.metadata.name.split('#')[0])}</p>
                <p>{'#' + String(tokenData.tokenId)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p>No NFTs owned</p>
        )
      }
    </main>
  );
}