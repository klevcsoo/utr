import {Identifiable} from "../../types/Identifiable";
import {ReactNode, useContext, useEffect} from "react";
import {DataTableContext, DataTableContextType} from "./DataTableContext";

export interface DataTableActionColumnProps<
    T extends Identifiable<object>
> {
    list: T[];

    element(entry: T): ReactNode;
}

export function DataTableActionColumn<
    T extends Identifiable<object>
>(props: DataTableActionColumnProps<T>) {
    const {setActionColumn} = useContext<DataTableContextType<T>>(DataTableContext);

    useEffect(() => {
        setActionColumn(props);
    }, [props, setActionColumn]);

    return null;
}