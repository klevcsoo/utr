export function WarningButton(props: {
    text: string
    onClick(): void
    disabled?: boolean
}) {
    return (
        <button type="button" disabled={props.disabled} onClick={props.onClick}
                className="max-w-xs min-w-max w-full px-4 py-1
                rounded-md bg-red-400 text-white
                hover:bg-red-600 transition-all
                disabled:pointer-events-none disabled:opacity-75">
            {props.text}
        </button>
    );
}
