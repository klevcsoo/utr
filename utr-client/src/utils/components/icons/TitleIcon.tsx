import {RawMaterialIcon} from "./RawMaterialIcon";

import {CommonNameOnlyProps} from "../../types";

export function TitleIcon(props: CommonNameOnlyProps) {
    return (
        <div className="w-16 h-16 grid place-content-center
        bg-blue-200 text-blue-500 rounded-full">
            <RawMaterialIcon name={props.name} className="scale-125"/>
        </div>
    );
}
