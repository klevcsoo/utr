import {ReactElement, ReactNode, useCallback, useState} from "react";
import {Identifiable} from "../../types/Identifiable";
import {DataTableContext, DataTableContextType} from "./DataTableContext";
import {DataTableDataColumnProps} from "./DataTableDataColumn";
import {typedObjectKeys} from "../../lib/utils";
import {Card} from "@material-tailwind/react";

export interface DataTableProps<T extends Identifiable<K>, K extends object = object> {
    dataList: T[];
    loadAllInOnePage?: boolean;
    propertyNameOverride?: { [key in keyof T]?: string };
    excludedProperties?: (keyof T)[];
    actionColumn?: (entry: T) => ReactNode;
    children: ReactElement<DataTableDataColumnProps<T>> | ReactElement<DataTableDataColumnProps<T>>[];
}

export function DataTable<
    T extends Identifiable<O>,
    O extends object = object
>(props: DataTableProps<T>) {
    const [headers, setHeaders] = useState<{ [key in keyof T]?: string }>({});
    const [rows, setRows] = useState<{ [key in keyof T]?: ReactNode }[]>(
        props.dataList.map(value => {
            return {id: value.id};
        })
    );

    const doSetColumn = useCallback<DataTableContextType<T>["setColumn"]>(options => {
        setHeaders(prevState => {
            (prevState as any)[options.forKey] = options.header ?? options.forKey;
            return prevState;
        });

        setRows(prevState => {
            for (let i = 0; i < prevState.length; i++) {
                prevState[i][options.forKey] = options.element(props.dataList[i][options.forKey]);
            }

            return prevState;
        });
    }, [props.dataList]);

    // noinspection com.haulmont.rcb.ArrayToJSXMapInspection
    return (
        <DataTableContext.Provider value={{
            list: props.dataList,
            setColumn: doSetColumn
        }}>
            {props.children}
            <Card>
                <table className="table-auto rounded-md overflow-hidden border-collapse w-full">
                    <thead className="bg-blue-gray-100 rounded-md border-b border-b-blue-gray-400">
                    <tr className="h-12">
                        {typedObjectKeys(headers).map((key, index) => (
                            <th key={index} className="text-start first:pl-4 last:pr-2 uppercase">
                                {headers[key]}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="overflow-x-scroll overflow-y-hidden">
                    {rows.map((entry, indexEntry) => (
                        <tr key={indexEntry} className="h-12 even:bg-blue-gray-50">
                            {typedObjectKeys(entry).map((key, indexKey) => {
                                return props.excludedProperties?.includes(key) ? null : (
                                    <td key={indexKey} className="first:pl-4 last:pr-4">
                                        {entry[key]}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Card>
        </DataTableContext.Provider>
    );
}
