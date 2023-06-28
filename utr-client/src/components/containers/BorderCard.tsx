import {BorderCardProps} from "../../types/componentProps/containers/BorderCardProps";

export function BorderCard(props: BorderCardProps) {
    return (
        <div className={(props.className ?? "") +
            " p-2 border border-slate-200 rounded-lg"}>
            {props.children}
        </div>
    );
}
