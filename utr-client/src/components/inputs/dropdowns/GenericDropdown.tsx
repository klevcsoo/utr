import {useMemo} from "react";

export function GenericDropdown<T extends string>(props: {
    options: T[] | readonly T[] | { [key in T]: string }
    selected: T
    onSelect(value: T): void
}) {
    const resolvedOptions = useMemo<[string, string][]>(() => {
        if (props.options instanceof Array) {
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
                focus:border-blue-400" value={props.selected}
                onChange={event => {
                    props.onSelect(event.currentTarget.value as T);
                }}>
            {resolvedOptions.map(([value, displayName], index) => (
                <option key={index} value={value}>{displayName}</option>
            ))}
        </select>
    );
}
