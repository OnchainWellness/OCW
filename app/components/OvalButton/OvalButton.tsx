import { FC } from "react"
import "./OvalButton.css"

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
    ...props
}) => {
    return (
        <button
            className={"rounded-full border border-primaryColor px-6 py-2 text-white " + className}
            type="button"
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    )
}

export default OvalButton