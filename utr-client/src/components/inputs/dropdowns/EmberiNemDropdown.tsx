import {EmberiNemId} from "../../../types/EmberiNemId";
import {useMemo} from "react";
import {GenericDropdown} from "./GenericDropdown";
import {CommonDropdownProps} from "../../../types/componentProps/common/CommonDropdownProps";
import {useGetEmberiNemElnevezes} from "../../../hooks/useGetEmberiNemElnevezes";

export function EmberiNemDropdown(props: CommonDropdownProps<EmberiNemId>) {
    const getElnevezes = useGetEmberiNemElnevezes();

    const options = useMemo<{ [key in EmberiNemId]: string }>(() => {
        return {
            NEM_FERFI: getElnevezes("NEM_FERFI"),
            NEM_NO: getElnevezes("NEM_NO")
        };
    }, [getElnevezes]);

    return (
        <GenericDropdown options={options}
                         selected={props.selected}
                         onSelect={props.onSelect}/>
    );
}
