import {EmberiNem} from "../../../types/EmberiNem";
import {useMemo} from "react";
import {GenericDropdown} from "./GenericDropdown";
import {CommonDropdownProps} from "../../../types/componentProps/common/CommonDropdownProps";

export function EmberiNemDropdown(props: CommonDropdownProps<EmberiNem>) {
    const options = useMemo<{ [key in EmberiNem]: string }>(() => {
        return {F: "férfi", N: "nő"};
    }, []);

    return (
        <GenericDropdown options={options}
                         selected={props.selected}
                         onSelect={props.onSelect}/>
    );
}
