import {FullPageModalProps} from "../../types/componentProps/modals/FullPageModalProps";

export default function FullPageModal(props: FullPageModalProps) {
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
