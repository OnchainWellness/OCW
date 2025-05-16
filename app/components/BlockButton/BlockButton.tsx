import { FC } from "react"
import "./BlockButton.css"

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
            className={"block-button hover:bg-primaryColor transition duration-200 ease-in-out " + className}
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