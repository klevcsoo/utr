import {ReactNode} from "react";
import {Identifiable} from "../../Identifiable";

export interface DataTableProps<T extends Identifiable<K>, K extends object = object> {
    dataList: T[];
    loadAllInOnePage?: boolean;
    propertyNameOverride?: { [key in keyof T]?: string };
    excludedProperties?: (keyof T)[];
    actionColumn?: (entry: T) => ReactNode;
}
