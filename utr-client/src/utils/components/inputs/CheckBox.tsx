export interface CheckBoxProps {
    value: boolean;
    disabled?: boolean;

    onValue(value: boolean): void;
}

export function CheckBox(props: CheckBoxProps) {
    return (
        <div className="grid place-content-center">
            <input type="checkbox" checked={props.value}
                   className="w-4 h-4" onChange={event => {
                props.onValue(event.currentTarget.checked);
            }}/>
        </div>
    );
}
