import Image from "next/image";
import logo from '@/assets/images/BTCB.svg'
import { createPublicClient, getContract, http } from "viem";
import { NFT_ABI } from "@/app/utils/abis/NFT";
import CreateMeetingButton from "./CreateMeetingButton";
import { desiredChainData } from "@/wagmi";

const publicClient = createPublicClient({
  chain: desiredChainData,
  transport: http(),
})

const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`

export default async function Page(props: {params: Promise<{id: string}>}) {
    const params = await props.params;
    const tokenOwner = await getTokenData(params.id)

    async function getTokenData(id: string) {
        const contract = getContract({ address: contractAddress, abi: NFT_ABI, client: publicClient })
        const tokenData = await contract.read.ownerOf([id]) as `0x${string}`
        return tokenData
    }


    return (
        <div className="mb-36">
            <main className="p-5 max-w-[1200px] mx-auto">
                {/* Head */}
                <div>
                    <Image src={logo} alt="logo" className="w-24 h-24 mx-auto mt-10" />
                    <h1 className="text-3xl text-center font-bold mt-4">OnchainWellness</h1>
                    <p className="text-center text-gray-500 mt-2">Connect your wallet to get started</p>
                </div>
                <div className="flex flex-row items-center justify-end my-4">
                    <CreateMeetingButton tokenOwnerAddress={tokenOwner} />
                </div>
                <h2 className="text-white">Description</h2>
                <p>Empowering individuals with secure, private, and personalized mental health support, Onchain Wellness redefines care for the modern, decentralized world. Our platform offers 1:1 individual therapy with licensed professionals, expert-led workshops by industry thought leaders, as well as TxAI, a groundbreaking digital wellness companion that rewards users for engaging in healthy behaviors. Accessible, innovative, and tailored to your unique journey, we&apos;re here to support you every step of the way.</p>
                <p></p>
            </main>
        </div>
    )
}
