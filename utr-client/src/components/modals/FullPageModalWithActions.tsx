import {FullPageModal} from "./FullPageModal";
import {TitleIcon} from "../icons/TitleIcon";
import {
    FullPageModalWithActionsProps
} from "../../types/componentProps/modals/FullPageModalWithActionsProps";

export function FullPageModalWithActions(props: FullPageModalWithActionsProps) {
    return (
        <FullPageModal>
            <div className="flex flex-row items-center
                    justify-start gap-6 p-6 min-w-max max-w-sm">
                <TitleIcon name={props.icon}/>
                <h2>{props.title}</h2>
            </div>
            <div className="w-full border border-slate-100"></div>
            <div className={props.className}>
                {props.children}
            </div>
            <div className="flex flex-row gap-2 p-6">
            </div>
        </FullPageModal>
    );
}