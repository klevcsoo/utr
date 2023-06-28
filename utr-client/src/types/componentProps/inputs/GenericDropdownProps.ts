import {CommonDropdownProps} from "../common/CommonDropdownProps";

export interface GenericDropdownProps<T extends string> extends CommonDropdownProps<T> {
    options: T[] | readonly T[] | { [key in T]: string };
}
