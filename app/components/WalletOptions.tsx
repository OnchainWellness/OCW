'use client'

import React from 'react'
import { Connector, useAccount, useConnect } from 'wagmi'
import BlockButton from './BlockButton/BlockButton'
import MetamaskIcon from '@/assets/images/metamask_logo.webp'
import CoinBaseIcon from '@/assets/images/coinbase-wallet-logo.webp'
import Image, { StaticImageData } from 'next/image'
// import { generateChallenge, verifySignature } from '../actions/challenge'

const connectorIdIconMap: { [key: string]: StaticImageData } = {
  'coinbaseWalletSDK': CoinBaseIcon,
  'metaMaskSDK': MetamaskIcon,
}

export function WalletOptions() {
  const { connectors, connect, data, isSuccess } = useConnect()
  // const { signTypedData } = useSignTypedData()
  const { address } = useAccount()

  console.log({ connectors, data, address, isSuccess })

  // React.useEffect(() => {
  //   if (isSuccess && address) {
  //       generateChallenge(address)
  //         .then((data) => {
  //           const typedData = {
  //             types: {
  //               EIP712Domain: [
  //                 { name: 'name', type: 'string' },
  //                 { name: 'version', type: 'string' },
  //               ],
  //               Challenge: Object.keys(data.message).map((key) => ({
  //                 name: key,
  //                 type: typeof data.message[key as keyof typeof data.message] === 'string' ? 'string' : 'unknown',
  //               })),
  //             },
  //             primaryType: "Challenge" as const,
  //             domain: {
  //               name: data.domain.name,
  //               version: data.domain.version,
  //             },
  //             message: data.message,
  //           };
  //           signTypedData(typedData, {
  //             onSuccess: (signature) => {
  //               verifySignature(signature, address)
  //               .then((data) => {
  //                 console.log('verified: ' + data)
  //               }
  //               )
  //             },
  //             onError: () => {},
  //           })
  //         })
  //   }
  // }, [isSuccess, address, signTypedData])

  return connectors.map((connector) => (
    <WalletOption
      key={connector.uid}
      connector={connector}
      onClick={() => connect({ connector })}
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