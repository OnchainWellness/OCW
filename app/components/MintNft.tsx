import { 
  useAccount, 
  useReadContract, 
} from 'wagmi'
import { NFT_ABI } from '../utils/abis/NFT'
import { useNFT } from '../hooks/NFT'
import OvalButton from './OvalButton/OvalButton'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { ConnectWallet } from './ConnectWallet'
import { getConnections, switchChain } from 'wagmi/actions'
import { desiredChainData, wagmiConfig } from '@/wagmi'
import { LifecycleStatus, Transaction, TransactionButton, TransactionSponsor, TransactionStatus, TransactionStatusAction, TransactionStatusLabel, TransactionToast, TransactionToastAction, TransactionToastIcon, TransactionToastLabel } from '@coinbase/onchainkit/transaction'
import BlockButton from './BlockButton/BlockButton'

const desiredChainId = desiredChainData.id // Base Sepolia
 
export function MintNFT({contractAddress}: {contractAddress: `0x${string}`} ) {
    const {address, chainId} = useAccount()
    const router = useRouter()
    const [mintSuccess, setMintSuccess] = useState(false)

  const {
    data,
    refetch: refetchBalance,
  } = useReadContract({
    address: contractAddress,
    abi: NFT_ABI,
    functionName: 'getNftsOwned',
    args: [address]
  })

  const {
    data: nftPrice,
  } = useReadContract({
    address: contractAddress,
    abi: NFT_ABI,
    functionName: 'mintPrice'
  })

  console.log({nftPrice})
  const balance = data as unknown as { tokenId: bigint }[]
  const lastTokenId = balance?.[balance.length - 1]?.tokenId

  const { contractNameData } = useNFT(contractAddress)

  const mintCall = {
      address: contractAddress,
      abi: NFT_ABI,
      functionName: 'safeMint',
      value: (nftPrice as bigint) > 0 ? (nftPrice as bigint) + BigInt(1) : undefined,
      args: [address],
    }

  async function changeRoute() {
    router.push('/token/' + lastTokenId)
  }

  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    if(status.statusName === 'success') {
      setMintSuccess(true)
      refetchBalance()
    }
  }, [refetchBalance]);

  return (
      <div className='bg-black p-10 pb-0 rounded-lg shadow-md flex flex-col justify-between gap-5'>
        {contractNameData.data ? <h5 className='text-xl mb-1 text-white tracking-tight'>{String(contractNameData.data)}</h5> : <h5 className='text-xl mb-1 text-white tracking-tight'>Loading...</h5>}
        <div className='flex justify-between mb-4' >
          <p>price: 0.0001</p>
          <p>US$0.00</p>
        </div>

      <div className='flex justify-between'>
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
            })
            console.log({response})
          }}
          type="button"
        >
          Switch to Base
        </OvalButton> 
        :
        <Transaction
          chainId={desiredChainId}
          calls={[mintCall]}
          onStatus={handleOnStatus}
        >
          {
            mintSuccess ?
            <BlockButton onClick={changeRoute}>
              NFT Details
            </BlockButton> :
            <TransactionButton
              className='bg-black text-white border border-primaryColor hover:bg-primaryColor'
              text='Mint Token'
            />
          }
          <TransactionSponsor />
          <TransactionStatus>
            <TransactionStatusLabel />
            <TransactionStatusAction />
          </TransactionStatus>
          <TransactionToast>
            <TransactionToastIcon />
            <TransactionToastLabel />
            <TransactionToastAction />
          </TransactionToast>
        </Transaction>
        }
      </div>
      </div>
  )
}