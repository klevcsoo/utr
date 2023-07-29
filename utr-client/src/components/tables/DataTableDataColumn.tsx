import {Identifiable} from "../../types/Identifiable";
import {ReactNode, useContext} from "react";
import {DataTableContext, DataTableContextType} from "./DataTableContext";

export interface DataTableColumnProps<
    T extends Identifiable<O>,
    O extends object = object,
    K extends keyof T = keyof T
> {
    list: T[];
    forKey: K;
    header?: string;

    element(value: T[K]): ReactNode;
}

export function DataTableDataColumn<
    T extends Identifiable<O>,
    O extends object = object,
    K extends keyof T = keyof T
>(props: DataTableColumnProps<T, O, K>) {
    const context = useContext<DataTableContextType<T>>(DataTableContext);
    context.setColumn(props);

    return null;
}
