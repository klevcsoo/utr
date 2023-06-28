import {CommonButtonProps} from "../../../types/componentProps/common/CommonButtonProps";

export function SecondaryButton(props: CommonButtonProps) {
    return (
        <button type="button" disabled={props.disabled} onClick={props.onClick}
                className="max-w-xs min-w-max w-full px-4 py-1
                rounded-md bg-slate-100 text-inherit
                hover:bg-blue-100 hover:text-blue-500 transition-all
                disabled:pointer-events-none disabled:opacity-75">
            {props.text}
        </button>
    );
}
