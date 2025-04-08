'use client'

import { TabItem, Tabs } from "flowbite-react";
import { MintNFT } from "./MintNft";
import Subscribe from "./Subscribe";

export default function SubscribeOptions() {
    return(
        <Tabs
            variant="fullWidth"
            theme={{
                base: 'h-full flex-grow',
                tabpanel: 'h-full',
                tablist: {
                    tabitem: {
                        variant: {
                            fullWidth: {
                                active: {
                                    off: 'bg-zinc-950 dark:bg-zinc-950',
                                    on: 'bg-primaryColor dark:bg-primaryColor'
                                }
                            }
                        }
                    }
                },
                tabitemcontainer: {
                    base: 'p-10 py-2 flex-grow'
                }
            }}
        >
            <TabItem title='Mint Token'>
                <MintNFT contractAddress={process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`}/>
            </TabItem>
            <TabItem title='Spend permission'>
                <div className="flex flex-col justify-between h-full">
                    <p>Subscribe to Onchain Wellness by authorizing the app to collect payments from your account.</p>
                    <div>
                        <div className='flex justify-between mb-4' >
                        <p>price: 0.0001</p>
                        <p>US$0.00</p>
                        </div>
                    <Subscribe />
                    </div>
                </div>
            </TabItem>
        </Tabs>
    )
}