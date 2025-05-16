import { FC } from "react"
import "./BlockButton.css"
import { cn, pressable } from '@coinbase/onchainkit/theme'

interface IBlockButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    children: React.ReactNode;
    disabled?: boolean;
}

const BlockButton: FC<IBlockButton> = ({
    onClick,
    backgroundColor,
    borderColor,
    textColor,
    disabled,
    children,
    className,
    ...props
}) => {
    return (
        <button
            type="button"
            className={cn(
                disabled && pressable.disabled,
                "block-button hover:bg-primaryColor disabled:text-gray-500  transition duration-200 ease-in-out ",
                className
            )}
            disabled={disabled}
            onClick={onClick}
            style={{
                background: backgroundColor,
                borderColor,
                color: textColor,
            }} 
            {...props}
        >
            {children}
        </button>
    )
}

export default BlockButton