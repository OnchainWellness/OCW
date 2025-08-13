'use client';
import Image from "next/image";
import Link from "next/link";
import { ConnectWallet } from "./ConnectWallet";
import logo from '@/assets/images/evergreen.svg';
import { usePathname } from "next/navigation";

export default function Header() {
    const router = usePathname();
    const isHomePage = router === '/';
    const dappRoute = '/'

    console.log('isHomePage', isHomePage);
  return (
    <header className="pt-4 px-4">
        <div className="flex justify-between items-center">
            <Link href={isHomePage ? "/": dappRoute} className="flex items-center">
            <Image src={logo} alt='evergreen fund logo' width={32} height={32} />
            </Link>
            <div className="wallet-container">
            <ConnectWallet />
            </div>
        </div>
    </header>
  );
}