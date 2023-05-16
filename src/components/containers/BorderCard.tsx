import {ReactNode} from "react";

export function BorderCard(props: {
    className?: string
    children?: ReactNode
}) {
    return (
        <div className={(props.className ?? "") +
            " p-2 border border-slate-200 rounded-lg"}>
            {props.children}
        </div>
    );
}
