'use client'

import { useState } from "react";
import SubscribeOptions from "./SubscribeOptions";
import { Modal } from "./Modal";
import OvalButton from "./OvalButton/OvalButton";

function SubscribeButton() {
    const [showModal, setShowModal] = useState(false);

    function onClick() {
        setShowModal(true);
    }
    return (
        <div>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <div className='z-50 w-96 h-80 bg-black rounded-lg'>
                    <SubscribeOptions />
                </div>
            </Modal>
            <OvalButton
                onClick={onClick} 
            >
                <span style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                }}>Subscribe </span>
            </OvalButton>
        </div>
    )
}

export default SubscribeButton