import {ReactNode} from "react";

export function FullPagePopup(props: {
    children: ReactNode
    className?: string
    onClickOutside?(): void
}) {
    return (
        <div className="fixed inset-0 backdrop-blur-xl backdrop-saturate-150
		grid place-content-center">
            <div className={"max-w-md min-w-max bg-white rounded-lg " +
                "overflow-hidden shadow-xl " + (props.className ?? "")}>
                {props.children}
            </div>
        </div>
    );
}
