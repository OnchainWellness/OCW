import { useReadContract } from "wagmi";
import { NFT_ABI } from "../utils/abis/NFT";

export function useNFT(contractAddress: `0x${string}`) {
    const contractNameData = useReadContract({
        address: contractAddress,
        abi: NFT_ABI,
        functionName: 'name',
        args: [],
    });

    const contractMetadata = useReadContract({
        address: contractAddress,
        abi: NFT_ABI,
        functionName: 'tokenURI',
        args: [0],
    });

    return {
        contractNameData,
        contractMetadata,
    }
}