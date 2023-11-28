import {Input} from "@material-tailwind/react";

export interface NumberInputProps {
    value: number;
    label?: string;
    min?: number;
    max?: number;
    disabled?: boolean;
    className?: string;

    onValue(value: number): void;

    onSubmit?(): void;
}

export default function NumberInput(props: NumberInputProps) {
    return (
        <Input value={props.value} onChange={event => {
            const value = event.currentTarget.value;
            if (isNaN(parseInt(value))) {
                props.onValue(0);
            } else {
                props.onValue(parseInt(value));
            }
        }} min={props.min} max={props.max} label={props.label} onKeyDown={event => {
            if (event.code === "Enter" && props.onSubmit) {
                props.onSubmit();
            }
        }} disabled={props.disabled} className={props.className}/>
    );
}
