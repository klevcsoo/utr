import {ReactElement, ReactNode, useCallback, useState} from "react";
import {DataTableContext, DataTableContextType} from "./DataTableContext";
import {DataTableDataColumnProps} from "./DataTableDataColumn";
import {typedObjectKeys} from "../../lib/utils";
import {DataTableActionColumnProps} from "./DataTableActionColumn";
import {Identifiable} from "../../types";

export type DataTableChildren<T extends Identifiable<object>> =
    (ReactElement<DataTableDataColumnProps<T>> |
        ReactElement<DataTableActionColumnProps<T>>)[] |
    ReactElement<DataTableDataColumnProps<T>>

export interface DataTableProps<T extends Identifiable<object>> {
    dataList: T[];
    loadAllInOnePage?: boolean;
    propertyNameOverride?: { [key in keyof T]?: string };
    excludedProperties?: (keyof T)[];
    actionColumn?: (entry: T) => ReactNode;
    children: DataTableChildren<T>;
}

export function DataTable<T extends Identifiable<object>>(props: DataTableProps<T>) {
    const [headers, setHeaders] = useState<{ [key in keyof T]?: string }>({});
    const [rows, setRows] = useState<{ [key in keyof T]?: ReactNode }[]>(
        props.dataList.map(value => {
            return {id: value.id};
        })
    );
    const [actionRowCells, setActionRowCells] = useState<ReactNode[]>();

    const doSetDataColumn = useCallback<DataTableContextType<T>["setDataColumn"]>(options => {
        setHeaders(prevState => {
            (prevState as any)[options.forKey] = options.header ?? options.forKey;
            return prevState;
        });

        setRows(prevState => {
            for (let i = 0; i < prevState.length; i++) {
                (prevState[i])[options.forKey] = options.element(props.dataList[i][options.forKey]);
            }

            return prevState;
        });
    }, [props.dataList]);

    const doSetActionColum = useCallback<DataTableContextType<T>["setActionColumn"]>(options => {
        setActionRowCells(rows.map((_, index) => options.element(props.dataList[index])));
    }, [props.dataList, rows]);

    // noinspection com.haulmont.rcb.ArrayToJSXMapInspection
    return (
        <DataTableContext.Provider value={{
            list: props.dataList,
            setDataColumn: doSetDataColumn,
            setActionColumn: doSetActionColum
        }}>
            {props.children}
            <table className="table-auto overflow-hidden w-full border-collapse">
                <thead className="bg-gray-100 border border-gray-100">
                <tr className="h-12">
                    {typedObjectKeys(headers).map((key, index) => (
                        <th key={index} className="text-start first:pl-4 last:pr-2 uppercase">
                            {headers[key]}
                        </th>
                    ))}
                    {!!actionRowCells ? (
                        <th className="text-start first:pl-4 last:pr-2 uppercase"></th>
                    ) : null}
                </tr>
                </thead>
                <tbody className="overflow-x-scroll overflow-y-hidden">
                {rows.map((entry, indexEntry) => (
                    <tr key={indexEntry} className="h-12 even:bg-gray-50 border border-gray-100">
                        {typedObjectKeys(entry).map((key, indexKey) => {
                            return props.excludedProperties?.includes(key) ? null : (
                                <td key={indexKey} className="first:pl-4 last:pr-4">
                                    {entry[key]}
                                </td>
                            );
                        })}
                        {!!actionRowCells ? (
                            <td className="first:pl-4 last:pr-4">
                                <div className="w-full flex flex-row items-center
                                    justify-end gap-2">
                                    {actionRowCells[indexEntry]}
                                </div>
                            </td>
                        ) : null}
                    </tr>
                ))}
                </tbody>
            </table>
        </DataTableContext.Provider>
    );
}