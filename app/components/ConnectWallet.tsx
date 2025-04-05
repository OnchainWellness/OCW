'use client'

import { useState } from "react";
import { useAccount } from "wagmi";
import { Account } from "./Account";
import OvalButton from "./OvalButton/OvalButton";
import { Modal } from "./Modal";
import { WalletOptions } from "./WalletOptions";

export function ConnectWallet() {
  const { isConnected } = useAccount();
  const [isOpen, setIsOpen] = useState(false);

  if(isConnected && isOpen) setIsOpen(false);
  if(isConnected) return <Account />;

  return (
    <div>
        <OvalButton className='border border-blue-600' onClick={() => {
          setIsOpen(true);
        }}>
        Connect Wallet
      </OvalButton>
      <Modal isOpen={isOpen} onClose={()=> setIsOpen(false)} className='z-10'>
        <div className="px-10 pt-20 pb-14 rounded">
          <h3 className='text-3xl text-center text-white mb-2'>Welcome to Onchain Wellness</h3>
          <h4 className='text-xl text-center mb-6'>Please select a login method</h4>
          <WalletOptions />
        </div>
      </Modal>
    </div>
  );
}
