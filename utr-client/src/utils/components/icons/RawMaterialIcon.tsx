export interface RawMaterialIconProps {
    name: string;
    className?: string;
}

export function RawMaterialIcon(props: RawMaterialIconProps) {
    return (
        <span className={
            "material-symbols-rounded text-inherit select-none " +
            props.className ?? ""
        }>
			{props.name}
		</span>
    );
}
