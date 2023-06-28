import {ReactNode} from "react";

export interface FullPageModalProps {
    children: ReactNode;
    className?: string;

    onClickOutside?(): void;
}
