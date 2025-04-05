import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

export function Account() {
  const { address, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);

  console.log('chain', chain)

  const simplifiedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''

  return (
    <div className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white rounded-md border border-primaryColor focus:outline-none"
        onClick={toggleDropdown}
      >
        {ensAvatar && <Image alt="ENS Avatar" src={ensAvatar} />}
         {address && <div>{ensName ? `${ensName} (${simplifiedAddress})` : simplifiedAddress}</div>}
      </button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div onClick={toggleDropdown} className="absolute w-full mt-2 rounded-md shadow-xl ring-2 bg-zinc-800 text-white ring-gray-50 ring-opacity-10">
          <div className="hover:bg-zinc-700" role="menu">
            <Link className='block px-4 py-2' href={'/profile/' + address}>Profile</Link>
          </div>
          <div className="hover:bg-zinc-700" role="menu">
            <button className='px-4 py-2' onClick={() => disconnect()}>Disconnect</button>
          </div>
        </div>
      )}
    </div>
  );
}