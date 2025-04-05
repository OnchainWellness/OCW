import { 
  useAccount, 
  useReadContract, 
  useWaitForTransactionReceipt, 
  useWriteContract,
} from 'wagmi'
import { NFT_ABI } from '../utils/abis/NFT'
import { useNFT } from '../hooks/NFT'
import OvalButton from './OvalButton/OvalButton'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ConnectWallet } from './ConnectWallet'
import { getConnections, switchChain } from 'wagmi/actions'
import { wagmiConfig } from '@/wagmi'

const desiredChainId = 84532 // Base Sepolia
 
export function MintNFT({contractAddress}: {contractAddress: `0x${string}`} ) {
    const {address, chainId} = useAccount()
    const router = useRouter()

  const { 
    data: hash,
    error,   
    isPending, 
    writeContract ,

  } = useWriteContract() 

  const {
    data,
    refetch: refetchBalance,
    isRefetching
  } = useReadContract({
    address: contractAddress,
    abi: NFT_ABI,
    functionName: 'getNftsOwned',
    args: [address]
  })
  const balance = data as unknown as { tokenId: bigint }[]
  const lastTokenId = balance?.[balance.length - 1]?.tokenId

  const { contractNameData } = useNFT(contractAddress)

  async function mintNft() { 
    writeContract({
      address: contractAddress,
      abi: NFT_ABI,
      functionName: 'mintTo',
      args: [address],
    })
  }

  async function changeRoute() {
    router.push('/token/' + lastTokenId)
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    }) 

  useEffect(() => {
    if (isConfirmed) {
      refetchBalance()
      // router.push('/dapp')
    }
  }, [refetchBalance, isConfirmed])

  return (
      <div className='bg-black p-10 rounded-lg w-[300px] shadow-md'>
        {contractNameData.data ? <h5 className='text-xl mb-1 text-white tracking-tight'>{String(contractNameData.data)}</h5> : <h5 className='text-xl mb-1 text-white tracking-tight'>Loading...</h5>}
        <div className='flex justify-between mb-4' >
          <p>price: 0.0001</p>
          <p>US$0.00</p>
        </div>

      <div className='mb-3 mt-2 text-center'>
        {isPending && <p>Waiting for user confirmation</p>}
        {isConfirming && <p>Processing transaction, please wait...</p>}
        {isConfirmed && <p>Token minted! </p>}
        {error && <p>Error: {String(error.message)}</p>}
      </div>

      <div className='flex justify-center'>
        {
        !address ?
          <ConnectWallet /> :
          chainId !== desiredChainId ?
          <OvalButton
          onClick={async () => {
            const connections = getConnections(wagmiConfig)
            console.log({connections})
            const response = await switchChain(wagmiConfig, {
              chainId: desiredChainId,
              connector: connections[0].connector,
            })
            console.log({response})
          }}
          disabled={isPending || isConfirming || isRefetching}
          type="button"
        >
          Switch to Base
        </OvalButton> :
          <OvalButton 
          onClick={isConfirmed ? changeRoute : mintNft}
          disabled={isPending || isConfirming || isRefetching} 
          type="button"
        >
          {isConfirmed ? 'Token info' : isPending || isConfirming ? 'Confirming...' : 'Mint Token'} 
        </OvalButton>
        }
      </div>
      </div>
  )
}