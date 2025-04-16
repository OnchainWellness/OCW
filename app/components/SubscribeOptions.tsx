'use client'

import { TabItem, Tabs } from "flowbite-react";
import { MintNFT } from "./MintNft";
import Subscribe from "./Subscribe";
import { useEffect, useState } from "react";
import { Token, TokenSelectDropdown } from "@coinbase/onchainkit/token";
import { tokensOptions } from "@/wagmi";
import { getSubscriptionPrice } from "../actions/token";
import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "viem";

export default function SubscribeOptions() {
    const [token, setToken] = useState<Token>()

    const {data: tokenPrice, refetch: refetchTokenPrice} = useQuery({
        queryKey: ["tokenPrice"],
        queryFn:async () => await getSubscriptionPrice(token?.address),
        refetchOnWindowFocus: false,
        enabled: !!token,
    });

    const formattedtokenPrice = tokenPrice && token ? formatUnits(tokenPrice as bigint, token.decimals) : undefined

    useEffect(() => {
        refetchTokenPrice()
    }, [token, refetchTokenPrice])

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
                <div className="flex flex-col justify-between h-full">
                    <p>Subscribe to Onchain Wellness by minting our NFT</p>
                    <div>
                        <TokenSelectDropdown
                            token={token} 
                            setToken={setToken} 
                            options={tokensOptions} 
                        /> 
                        <div className='flex justify-between mt-2 mb-4' >
                        <p>price: {formattedtokenPrice?.toString()}</p>
                        <p>US$0.00</p>
                        </div>
                        <MintNFT token={token} contractAddress={process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`}/>
                    </div>
                </div>
            </TabItem>
            <TabItem title='Spend permission'>
                <div className="flex flex-col justify-between h-full">
                    <p>Subscribe to Onchain Wellness by authorizing the app to collect payments from your account.</p>
                    <div>
                        <TokenSelectDropdown
                            token={token} 
                            setToken={setToken} 
                            options={tokensOptions} 
                        /> 
                        <div className='flex justify-between mt-2 mb-4' >
                        <p>price: {formattedtokenPrice?.toString()}</p>
                        <p>US$0.00</p>
                        </div>
                    <Subscribe token={token}/>
                    </div>
                </div>
            </TabItem>
        </Tabs>
    )
}