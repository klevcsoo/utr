import {Identifiable} from "../../types/Identifiable";
import {ReactNode, useContext, useEffect} from "react";
import {DataTableContext, DataTableContextType} from "./DataTableContext";

export interface DataTableDataColumnProps<
    T extends Identifiable<object>,
    K extends keyof T = keyof T
> {
    list: T[];
    forKey: K;
    header?: string;

    element(value: T[K]): ReactNode;
}

export default function DataTableDataColumn<
    T extends Identifiable<object>,
    K extends keyof T = keyof T
>(props: DataTableDataColumnProps<T, K>) {
    const {setDataColumn} = useContext<DataTableContextType<T>>(DataTableContext);

    useEffect(() => {
        setDataColumn(props);
    }, [props, setDataColumn]);

    return null;
}
