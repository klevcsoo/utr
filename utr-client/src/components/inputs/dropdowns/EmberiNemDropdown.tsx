import {EmberiNem} from "../../../types/EmberiNem";
import {useMemo} from "react";
import {GenericDropdown} from "./GenericDropdown";

export function EmberiNemDropdown(props: {
    selected: EmberiNem
    onSelected(value: EmberiNem): void
}) {
    const options = useMemo<{ [key in EmberiNem]: string }>(() => {
        return {F: "férfi", N: "nő"};
    }, []);

    return (
        <GenericDropdown options={options}
                         selected={props.selected}
                         onSelect={props.onSelected}/>
    );
}
