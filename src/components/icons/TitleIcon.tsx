import {RawMaterialIcon} from "./RawMaterialIcon";

export function TitleIcon(props: {
    name: string
}) {
    return (
        <div className="w-16 h-16 grid place-content-center
        bg-blue-200 rounded-full">
            <RawMaterialIcon name={props.name} className="text-blue-500 scale-125"/>
        </div>
    );
}
