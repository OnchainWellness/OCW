'use client'

import { createMeeting } from "@/app/actions/meetings";
import { Modal } from "@/app/components/Modal";
import OvalButton from "@/app/components/OvalButton/OvalButton";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function CreateMeetingButton({tokenOwnerAddress}: { tokenOwnerAddress: `0x${string}` }) {
    const { address } = useAccount();
    const [isOpen, setIsOpen] = useState(false);

    const { data: meetingData, isLoading, isSuccess, refetch: refetchCreateMeeting } = useQuery({
        queryKey: ['meeting'],
        queryFn: async () => {
            const response = await createMeeting();
            return response;
        },
        enabled: false,
    })

    const handleClick = async () => {
        setIsOpen(true);
        if (!isSuccess) {
            refetchCreateMeeting();
        }
    };

    const simplifiedAddress = tokenOwnerAddress ? `${tokenOwnerAddress.slice(0, 6)}...${tokenOwnerAddress.slice(-4)}` : ''

    if(address?.toLocaleLowerCase() === tokenOwnerAddress?.toLocaleLowerCase()) {
        return (
            <div>
                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className='z-10 text-center'>
                    <div className="px-10 pt-20 pb-14 rounded">
                        <h3 className="text-3xl text-center text-white mb-2">Getting meeting details</h3>
                        <div className="mb-4">
                        {isLoading && <p>Loading...</p>}
                        {isSuccess && <p>Meeting Created Successfully!</p>}
                        {isSuccess && (
                            <div>
                                <p>Meeting ID: {meetingData?.id}</p>
                                <p>Meeting Password: {meetingData?.pstn_password}</p>
                            </div>
                        )}
                        </div>
                        { isSuccess && meetingData ? <Link href={meetingData?.join_url} target="_blank" rel="noopener noreferrer">
                        <OvalButton
                        onClick={() => {}}
                        className="bg-blue-500 text-white px-4 py-3 rounded"
                        disabled={isLoading}
                        >
                        {isLoading ? 'Generating...' : 'Open Meeting Link'}
                        </OvalButton>
                        </Link> : null }
                    </div>
                </Modal>
                <OvalButton
                onClick={handleClick}
                className="bg-blue-500 text-white px-4 py-3 rounded"
                >
                    {isSuccess ? 'Get Meeting' : 'Create Meeting'}
                </OvalButton>
            </div>
        );
    }
    
    return (
        <div>
        <strong className="text-white">
            Owned by:
        </strong>
        <p>{simplifiedAddress}</p>
        </div>
    )
}