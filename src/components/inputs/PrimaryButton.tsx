export function PrimaryButton(props: {
    text: string
    onClick?(): void
    disabled?: boolean
}) {
    return (
        <button type="button" disabled={props.disabled} onClick={props.onClick}
                className="max-w-xs min-w-max w-full px-4 py-1
                rounded-md bg-blue-400 text-white
                hover:bg-blue-600 transition-all
                disabled:pointer-events-none disabled:opacity-75">
            {props.text}
        </button>
    );
}
