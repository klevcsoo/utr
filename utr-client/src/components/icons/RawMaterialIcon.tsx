import {RawMaterialIconProps} from "../../types/componentProps/icons/RawMaterialIconProps";

export default function RawMaterialIcon(props: RawMaterialIconProps) {
    return (
        <span className={
            "material-symbols-rounded text-inherit select-none " +
            props.className ?? ""
        }>
			{props.name}
		</span>
    );
}
