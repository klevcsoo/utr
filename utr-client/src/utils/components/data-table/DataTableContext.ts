import {createContext} from "react";
import {DataTableDataColumnProps} from "./DataTableDataColumn";
import {DataTableActionColumnProps} from "./DataTableActionColumn";
import {Identifiable} from "../../types";

export type DataTableContextType<
    T extends Identifiable<O>,
    O extends object = object,
> = {
    list: T[]
    setDataColumn(options: DataTableDataColumnProps<T>): void
    setActionColumn(options: DataTableActionColumnProps<T>): void
}

export const DataTableContext = createContext<DataTableContextType<any>>({
    list: [],
    setDataColumn(): void {
    },
    setActionColumn(): void {
    }
});
