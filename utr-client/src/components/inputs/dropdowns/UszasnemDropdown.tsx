import {useMemo} from "react";
import {GenericDropdown} from "./GenericDropdown";
import {UszasnemElnevezes} from "../../../types/UszasnemElnevezes";

export function UszasnemDropdown(props: {
    selected: UszasnemElnevezes
    onSelected(value: UszasnemElnevezes): void
}) {
    const options = useMemo<UszasnemElnevezes[]>(() => {
        return ["gyorsúszás", "mellúszás", "hátúszás", "pillangóúszás"];
    }, []);

    return (
        <GenericDropdown options={options}
                         selected={props.selected}
                         onSelect={props.onSelected}/>
    );
}
