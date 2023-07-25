import {CommonSelectProps} from "./CommonSelectProps";

export interface GenericSelectProps<T extends string> extends CommonSelectProps<T> {
    options: T[] | readonly T[] | { [key in T]: string };
    label: string;
}
