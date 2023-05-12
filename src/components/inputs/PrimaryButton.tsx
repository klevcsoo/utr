export function PrimaryButton(props: {
    text: string
    onClick(): void
    disabled?: boolean
}) {
    return (
        <button type="button" disabled={props.disabled} onClick={props.onClick}
                className="max-w-sm min-w-max w-full px-4 py-1
                rounded-md bg-sky-400 text-white
                hover:bg-sky-600 transition-all">
            {props.text}
        </button>
    );
}
