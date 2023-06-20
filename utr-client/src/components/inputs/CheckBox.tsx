export function CheckBox(props: {
    value: boolean
    onValue(value: boolean): void
    disabled?: boolean
}) {
    return (
        <div className="grid place-content-center">
            <input type="checkbox" checked={props.value}
                   className="w-4 h-4" onChange={event => {
                props.onValue(event.currentTarget.checked);
            }}/>
        </div>
    );
}
