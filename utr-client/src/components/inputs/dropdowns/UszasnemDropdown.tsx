import {useMemo} from "react";
import {GenericDropdown} from "./GenericDropdown";
import {UszasnemElnevezes} from "../../../types/UszasnemElnevezes";
import {CommonDropdownProps} from "../../../types/componentProps/common/CommonDropdownProps";

export function UszasnemDropdown(props: CommonDropdownProps<UszasnemElnevezes>) {
    const options = useMemo<UszasnemElnevezes[]>(() => {
        return ["gyorsúszás", "mellúszás", "hátúszás", "pillangóúszás"];
    }, []);

    return (
        <GenericDropdown options={options}
                         selected={props.selected}
                         onSelect={props.onSelect}/>
    );
}
