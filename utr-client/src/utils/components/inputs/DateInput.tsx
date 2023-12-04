import {useCallback} from "react";
import {Input} from "@material-tailwind/react";

export interface DateInputProps {
    value: number;
    min?: number;
    max?: number;
    label: string;

    onValue(date: number): void;
}

export function DateInput(props: DateInputProps) {
    const dateToString = useCallback((value: number) => {
        const d = new Date(value);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;

    }, []);

    return (
        <Input type="date"
               value={dateToString(props.value)}
               min={!!props.min ? dateToString(props.min) : undefined}
               max={!!props.max ? dateToString(props.max) : undefined}
               label={props.label}
               onChange={event => {
                   props.onValue(new Date(event.currentTarget.value).getTime());
               }}/>
    );
}
