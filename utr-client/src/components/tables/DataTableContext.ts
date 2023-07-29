import {createContext} from "react";
import {Identifiable} from "../../types/Identifiable";
import {DataTableColumnProps} from "./DataTableDataColumn";

export type DataTableContextType<
    T extends Identifiable<O>,
    O extends object = object,
> = {
    list: T[]
    setColumn(options: DataTableColumnProps<T>): void
}

export const DataTableContext = createContext<DataTableContextType<any>>({
    list: [],
    setColumn(): void {
    }
});
