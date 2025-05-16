'use client';

import { Avatar, Name } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';

interface BasenameDisplayProps {
  address: string;
}

function isHexAddress(address: string): address is `0x${string}` {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

export function BasenameDisplay({ address }: BasenameDisplayProps) {
  if (!isHexAddress(address)) return null;
  return (
    <div className="flex items-center gap-2">
      <style>{`
        .ock-text-foreground { color: white !important; }
        [data-testid="ock-defaultAvatarSVG"] { color: white !important; fill: white !important; }
      `}</style>
      <div className="rounded-full bg-white/10 p-1 border-2 border-white">
        <Avatar
          className='h-6 w-6 m-0 p-0'
          address={address}
          chain={base}
        />
      </div>
      <span className="font-bold text-lg">
        <Name address={address} chain={base} />
      </span>
    </div>
  );
} 