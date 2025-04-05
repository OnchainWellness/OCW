import { FC, ReactNode } from "react"
import "./Badge.css"

interface IBadge {
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    fullRounded?: boolean;
    children: ReactNode;
}

const Badge: FC<IBadge> = ({
    backgroundColor,
    borderColor,
    textColor,
    children,
    fullRounded,
}) => {
    return (
        <span
            className="badge"
            style={{
                background: backgroundColor,
                borderColor,
                color: textColor,
                borderRadius: fullRounded ? '50%' : undefined,
                padding: fullRounded ? '0rem 1.5rem' : undefined,
                aspectRatio: fullRounded ? '1/1' : undefined,
            }} 
        >
            {children}
        </span>
    )
}

export default Badge