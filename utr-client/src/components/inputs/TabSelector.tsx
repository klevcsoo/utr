import {useSearchParams} from "react-router-dom";
import {TabSelectorProps} from "../../types/componentProps/inputs/TabSelectorProps";
import {useCallback} from "react";

export function TabSelector(props: TabSelectorProps) {
    const [searchParams, setSearchParams] = useSearchParams();

    const isActiveTab = useCallback((key: string) => {
        return searchParams.has("tab") ? (
            searchParams.get("tab") === key
        ) : (
            props.defaultTabKey === key
        );
    }, [props.defaultTabKey, searchParams]);

    const doSwitchTab = useCallback((key: string) => {
        setSearchParams(prevState => {
            prevState.set("tab", key);
            return prevState;
        });
    }, [setSearchParams]);

    return (
        <div className="flex flex-row gap-2 p-2 border rounded-md border-slate-200">
            {props.tabs.map(({key, name}, index) => (
                <div key={index} onClick={() => doSwitchTab(key)}
                     className={
                         `py-1 px-2 rounded-md cursor-pointer\
                         ${isActiveTab(key) ?
                             "bg-blue-400 text-white" :
                             "bg-transparent hover:bg-blue-100 hover:text-blue-500"
                         }`
                     }>
                    <p className="text-inherit">{name}</p>
                </div>
            ))}
        </div>
    );
}
