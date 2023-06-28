import {useMemo} from "react";
import {Identifiable} from "../../types/Identifiable";
import {DataTableProps} from "../../types/componentProps/tables/DataTableProps";

export function DataTable<
    T extends Identifiable<K>,
    K extends object = object
>(props: DataTableProps<T>) {
    const propDisplayNames = useMemo<{ [key in keyof T]?: string }>(() => {
        const out: { [key in keyof T]?: string } = {};

        for (const p of Object.keys(props.dataList[0] ?? {})) {
            out[p as keyof T] = p;
        }

        if (props.propertyNameOverride) {
            for (const p of Object.keys(props.propertyNameOverride)) {
                out[p as keyof T] = props.propertyNameOverride[p as keyof T];
            }
        }

        return out;
    }, [props.propertyNameOverride, props.dataList]);

    const columnNames = useMemo<string[]>(() => {
        const out = Object.keys(props.dataList[0] ?? {}).filter(key => {
            return !props.excludedProperties?.includes(key as keyof T);
        }).map(key => {
            return String(propDisplayNames[key as keyof T]);
        });

        if (!!props.actionColumn) {
            out.push("");
        }

        return out;
    }, [propDisplayNames, props.actionColumn, props.dataList, props.excludedProperties]);

    const columnValues = useMemo<string[][]>(() => {
        return props.dataList.map(entry => {
            return Object.keys(entry).filter(key => {
                return !props.excludedProperties?.includes(key as keyof T);
            }).map(key => {
                const val = entry[key as keyof T];
                if (val instanceof Date) {
                    return (val as Date).toLocaleDateString();
                }

                return String(val);
            });
        });
    }, [props.dataList, props.excludedProperties]);

    return (
        <div className="w-full flex flex-col gap-1">
            <table className="table-auto rounded-md overflow-hidden border-collapse">
                <thead className="bg-slate-100 rounded-md">
                <tr className="h-12">
                    {columnNames.map((value, index) => (
                        <th key={index} className="text-start first:pl-4 last:pr-2
                        uppercase">
                            {value}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100
                border-x border-b border-slate-100 overflow-hidden">
                {columnValues.map((entry, indexEntry) => (
                    <tr key={indexEntry} className="h-12">
                        {entry.map((value, indexValue) => (
                            <td key={indexValue} className="first:pl-4">
                                {value}
                            </td>
                        ))}
                        {!props.actionColumn ? null : (
                            <td className="pr-2">
                                <div className="flex flex-row items-center gap-2">
                                    {props.actionColumn(props.dataList[indexEntry])}
                                </div>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
