import {ReactNode} from "react";

export interface FullPageModalWithActionsProps {
    icon: string;
    title: string;
    children: ReactNode;
    className?: string;
    canComplete?: boolean;

    onComplete(): void;

    onDismiss(): void;
}
