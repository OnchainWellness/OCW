'use client'

import React, { useEffect } from 'react'
import { Connector, useAccount, useConnect, useDisconnect, useSignTypedData } from 'wagmi'
import BlockButton from './BlockButton/BlockButton'
import MetamaskIcon from '@/assets/images/metamask_logo.webp'
import CoinBaseIcon from '@/assets/images/coinbase-wallet-logo.webp'
import Image, { StaticImageData } from 'next/image'
import { generateChallenge } from '../actions/challenge'
import { signIn } from 'next-auth/webauthn'
import { switchChain } from 'wagmi/actions'
import { wagmiConfig } from '@/wagmi'
import { desiredChainData } from '@/config'
// import { generateChallenge, verifySignature } from '../actions/challenge'

const connectorIdIconMap: { [key: string]: StaticImageData } = {
  'coinbaseWalletSDK': CoinBaseIcon,
  'metaMaskSDK': MetamaskIcon,
}

export function WalletOptions() {
  const { address } = useAccount()
  const { connectors, connect, isSuccess} = useConnect()
  const { disconnect } = useDisconnect()
  const { signTypedData } = useSignTypedData()

  useEffect(() => {
    if(isSuccess && address) {
      generateChallenge(address)
        .then(async (data)=> {
          await switchChain(wagmiConfig, {
            chainId: desiredChainData.id
          })
          // @ts-expect-error bypass
          signTypedData(data, {
            onSuccess: (signature) => {
              signIn("credentials", {signature, address,redirect: false})
              .catch(error => {
                console.log({verifyError: error})
                disconnect()
              })
            }
          })
        })
    }

  }, [isSuccess, address, signTypedData, disconnect])

  return connectors.map((connector) => (
    <WalletOption
      key={connector.uid}
      connector={connector}
      onClick={() => {
        disconnect()
        connect({ connector })
      }}
    />
  ))
}

function WalletOption({
  connector,
  onClick,
}: {
  connector: Connector
  onClick: () => void
}) {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    ;(async () => {
      const provider = await connector.getProvider()
      setReady(!!provider)
    })()
  }, [connector])

  return (
    <BlockButton disabled={!ready} onClick={onClick} className='mb-4'>
      {connector.name}
      <Image className='inline-block ml-2' width={32} alt='' src={connectorIdIconMap[connector.id]} />
    </BlockButton>
  )
}