export function RawMaterialIcon(props: {
	name: string
	className?: string
}) {
	return (
		<span className={
			"material-symbols-rounded text-inherit " +
			props.className ?? ""
		}>
			{props.name}
		</span>
	);
}
