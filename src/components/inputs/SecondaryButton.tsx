export function SecondaryButton(props: {
    text: string
    onClick(): void
    disabled?: boolean
}) {
    return (
        <button type="button" disabled={props.disabled} onClick={props.onClick}
                className="max-w-sm px-4 py-1
                rounded-md bg-white text-inherit
                hover:bg-sky-100 hover:text-sky-500 transition-all">
            {props.text}
        </button>
    );
}
