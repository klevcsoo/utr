import {useMemo} from "react";
import {GenericSelectProps} from "./GenericSelectProps";
import {Option, Select} from "@material-tailwind/react";

export default function GenericSelect<T extends string>(props: GenericSelectProps<T>) {
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
        <Select id={`dropdown-${(new Date()).getTime()}${Math.random() * 100}`}
                value={props.selected} label={props.label}
                onChange={value => props.onSelect(value as T)}>
            {resolvedOptions.map(([value, displayName], index) => (
                <Option key={index} value={value}>{displayName}</Option>
            ))}
        </Select>
    );
}
