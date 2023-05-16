import {useMemo} from "react";

export function Dropdown(props: {
    options: string[] | { [key: string]: string }
    onSelect(index: number): void
}) {
    const resolvedOptions = useMemo<[string, string][]>(() => {
        if (!!props.options["join"]) {
            return (props.options as string[]).map(value => [value, value]);
        } else {
            return Object.keys(props.options).map(key => {
                return [key, (props.options as { [key: string]: string })[key]];
            });
        }
    }, [props.options]);

    return (
        <select id={`dropdown-${(new Date()).getTime()}${Math.random() * 100}`}
                className="max-w-xs w-full h-8 px-2 border-2 rounded-md
                border-slate-200 bg-slate-100 focus:outline-none
                focus:border-blue-400">
            {resolvedOptions.map(([value, displayName], index) => (
                <option key={index} value={value}>{displayName}</option>
            ))}
        </select>
    );
}
