import { FC } from "react"
import "./OvalButton.css"
import { cn, pressable } from "@coinbase/onchainkit/theme";

interface IOvalButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onClick: () => void;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
}

const OvalButton: FC<IOvalButton> = ({
    onClick,
    children,
    className,
    disabled,
    ...props
}) => {
    return (
        <button
            className={cn(
                disabled && pressable.disabled,
                "rounded-full border border-primaryColor px-6 py-2 text-white "
                ,className
            )}
            type="button"
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    )
}

export default OvalButton