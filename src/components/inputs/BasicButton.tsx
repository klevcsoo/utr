export function BasicButton(props: {
    text: string
    onClick(): void
    disabled?: boolean
}) {
    return (
        <button type="button" disabled={props.disabled} onClick={props.onClick}
                className="max-w-sm px-4 py-1
                rounded-md bg-blue-400 text-white text-lg
                hover:bg-blue-600 transition-all">
            {props.text}
        </button>
    );
}
