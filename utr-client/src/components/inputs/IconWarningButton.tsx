import {RawMaterialIcon} from "../icons/RawMaterialIcon";

export function IconWarningButton(props: {
    iconName: string
    onClick?(): void
}) {
    return (
        <button type="button" onClick={() => {
            if (!!props.onClick && window.confirm("Biztos?")) {
                props.onClick();
            }
        }}
                className="grid place-content-center p-1 bg-red-100 rounded-md
                text-red-500 hover:bg-red-500 group">
            <RawMaterialIcon name={props.iconName}
                             className="group-hover:text-white"/>
        </button>
    );
}
