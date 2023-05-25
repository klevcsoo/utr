export function RawMaterialIcon(props: {
    name: string
    className?: string
}) {
    return (
        <span className={
            "material-symbols-rounded text-inherit select-none " +
            props.className ?? ""
        }>
			{props.name}
		</span>
    );
}
