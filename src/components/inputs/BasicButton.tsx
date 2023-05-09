export function BasicButton(props: {
    text: string
    onClick(): void
    disabled?: boolean
}) {
    return (
        <button type="button" disabled={props.disabled} onClick={props.onClick}
                className="disabled:opacity-50">
            {props.text}
        </button>
    );
}
