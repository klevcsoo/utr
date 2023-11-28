import {useCallback} from "react";

export interface DateInputProps {
    value: number;
    min?: number;
    max?: number;

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
        <input type="date" className="max-w-sm h-8 px-2 border-2 rounded-md
               border-slate-200 bg-slate-100 focus:outline-none focus:border-blue-400"
               value={dateToString(props.value)}
               min={!!props.min ? dateToString(props.min) : undefined}
               max={!!props.max ? dateToString(props.max) : undefined}
               onChange={event => {
                   props.onValue(new Date(event.currentTarget.value).getTime());
               }}/>
    );
}
