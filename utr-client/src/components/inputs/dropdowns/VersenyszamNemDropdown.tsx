import {EmberiNemId} from "../../../types/EmberiNemId";
import {useMemo} from "react";
import {GenericDropdown} from "./GenericDropdown";
import {CommonDropdownProps} from "../../../types/componentProps/common/CommonDropdownProps";
import {useGetVersenyszamNemElnevezes} from "../../../hooks/useGetVersenyszamNemElnevezes";

export function VersenyszamNemDropdown(props: CommonDropdownProps<EmberiNemId>) {
    const getElnevezes = useGetVersenyszamNemElnevezes();

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
