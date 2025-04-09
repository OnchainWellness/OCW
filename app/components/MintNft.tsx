import { 
  useAccount, 
  useReadContract, 
} from 'wagmi'
import { NFT_ABI } from '../utils/abis/NFT'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { ConnectWallet } from './ConnectWallet'
import { switchChain } from 'wagmi/actions'
import { BTCB_ADDRESS, desiredChainData, wagmiConfig } from '@/wagmi'
import { LifecycleStatus, Transaction, TransactionButton, TransactionSponsor, TransactionStatus, TransactionStatusAction, TransactionStatusLabel, TransactionToast, TransactionToastAction, TransactionToastIcon, TransactionToastLabel } from '@coinbase/onchainkit/transaction'
import BlockButton from './BlockButton/BlockButton'
import { Token } from '@coinbase/onchainkit/token'
import { ERC20_ABI } from '../utils/abis/ERC20'

const desiredChainId = desiredChainData.id // Base Sepolia
 
export function MintNFT({contractAddress, token}: {contractAddress: `0x${string}`, token: Token | undefined} ) {
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

  const {
    data: allowance
  } = useReadContract({
    address: token?.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [address, contractAddress]
  })

  const {
    data: nftPriceErc20
  } = useReadContract({
    address: contractAddress,
    abi: NFT_ABI,
    functionName: 'mintPriceErc20'
  })


  const balance = data as unknown as { tokenId: bigint }[]
  const lastTokenId = balance?.[balance.length - 1]?.tokenId

  const approveCall = {
    address: token?.address,
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [contractAddress, nftPriceErc20 as bigint],
  }

  const mintWithErc20Call = {
    address: contractAddress,
    abi: NFT_ABI,
    functionName: 'mintWithErc20',
    args: [address],
  }

  const mintCall = {
      address: contractAddress,
      abi: NFT_ABI,
      functionName: 'safeMint',
      value: (nftPrice as bigint) > 0 ? (nftPrice as bigint) + BigInt(1) : undefined,
      args: [address],
    }

  const calls = token?.address === BTCB_ADDRESS ? [mintWithErc20Call] : [mintCall] 
  const aproveIsNeeded = ((allowance as bigint) < (nftPriceErc20 as bigint))

  if (aproveIsNeeded) {
    // @ts-expect-error bypass
    calls.unshift(approveCall)
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
        <div>
        {
        !address ?
          <ConnectWallet /> :
          chainId !== desiredChainId ?
          <BlockButton
          onClick={async () => {
            await switchChain(wagmiConfig, {
              chainId: desiredChainId,
            })
          }}
          type="button"
        >
          Switch to Base
        </BlockButton> 
        :
        <Transaction
          className='gap-0'
          chainId={desiredChainId}
          // @ts-expect-error bypass
          calls={calls}
          onStatus={handleOnStatus}
        >
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
          {
            mintSuccess ?
            <BlockButton onClick={changeRoute}>
              NFT Details
            </BlockButton> :
            <TransactionButton
              className='bg-black text-white border border-primaryColor hover:bg-primaryColor'
              text={!aproveIsNeeded ? 'Mint Token' : 'Approve'}
            />
          }
        </Transaction>
        }
      </div>
  )
}