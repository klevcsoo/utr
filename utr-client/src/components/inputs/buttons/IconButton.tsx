import {RawMaterialIcon} from "../../icons/RawMaterialIcon";
import {CommonIconButtonProps} from "../../../types/componentProps/common/CommonIconButtonProps";

export function IconButton(props: CommonIconButtonProps) {
    return (
        <button type="button" onClick={props.onClick}
                className="grid place-content-center p-1 bg-slate-100 rounded-md
                hover:bg-blue-100 group">
            <RawMaterialIcon name={props.iconName}
                             className="group-hover:text-blue-500"/>
        </button>
    );
}
