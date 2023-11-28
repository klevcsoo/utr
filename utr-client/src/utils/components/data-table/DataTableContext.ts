import {createContext} from "react";
import {Identifiable} from "../../../types/Identifiable";
import {DataTableDataColumnProps} from "./DataTableDataColumn";
import {DataTableActionColumnProps} from "./DataTableActionColumn";

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
