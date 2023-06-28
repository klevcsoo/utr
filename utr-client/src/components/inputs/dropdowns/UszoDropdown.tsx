import {GenericDropdown} from "./GenericDropdown";
import {LoadingSpinner} from "../../LoadingSpinner";
import {useMemo} from "react";
import {useUszokList} from "../../../hooks/uszok/useUszokList";
import {UszoDropdownProps} from "../../../types/componentProps/inputs/UszoDropdownProps";

export function UszoDropdown(props: UszoDropdownProps) {
    const [uszok, loadingUszok] = useUszokList(props.csapatId);

    const options = useMemo<{ [id: string]: string }>(() => {
        const out: { [id: string]: string } = {
            "NaN": "-"
        };

        uszok.forEach(value => {
            out[String(value.id)] = value.nev;
        });

        return out;
    }, [uszok]);

    return loadingUszok || !uszok ? (
        <LoadingSpinner scale={30}/>
    ) : (
        <GenericDropdown options={options}
                         selected={String(props.selected)}
                         onSelect={value => {
                             props.onSelect(parseInt(value));
                         }}/>
    );
}
