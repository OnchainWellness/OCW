'use client'

import { TabItem, Tabs } from "flowbite-react";
import { MintNFT } from "./MintNft";
import Subscribe from "./Subscribe";

export default function SubscribeOptions() {
    return(
        <Tabs>
            <TabItem title='Mint Token'>
                <MintNFT contractAddress={process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`}/> :
            </TabItem>
            <TabItem title='Spend permission'>
                <Subscribe />
            </TabItem>
        </Tabs>
    )
}