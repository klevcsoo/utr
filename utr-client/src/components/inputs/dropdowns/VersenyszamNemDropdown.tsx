import {EmberiNem} from "../../../types/EmberiNem";
import {useMemo} from "react";
import {GenericDropdown} from "./GenericDropdown";

export function VersenyszamNemDropdown(props: {
    selected: EmberiNem
    onSelected(value: EmberiNem): void
}) {
    const options = useMemo<{ [key in EmberiNem]: string }>(() => {
        return {F: "fiú", N: "leány"};
    }, []);

    return (
        <GenericDropdown options={options}
                         selected={props.selected}
                         onSelect={props.onSelected}/>
    );
}
