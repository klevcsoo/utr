import {useMemo} from "react";
import {GenericDropdown} from "./GenericDropdown";
import {UszasnemId} from "../../../types/UszasnemId";
import {CommonDropdownProps} from "../../../types/componentProps/common/CommonDropdownProps";
import {useGetUszasnemElnevezes} from "../../../hooks/useGetUszasnemElnevezes";

export function UszasnemDropdown(props: CommonDropdownProps<UszasnemId>) {
    const getElnevezes = useGetUszasnemElnevezes();

    const options = useMemo<{ [key in UszasnemId]: string }>(() => {
        return {
            USZASNEM_GYORS: getElnevezes("USZASNEM_GYORS"),
            USZASNEM_MELL: getElnevezes("USZASNEM_MELL"),
            USZASNEM_HAT: getElnevezes("USZASNEM_HAT"),
            USZASNEM_PILLANGO: getElnevezes("USZASNEM_PILLANGO")
        };
    }, [getElnevezes]);

    return (
        <GenericDropdown options={options}
                         selected={props.selected}
                         onSelect={props.onSelect}/>
    );
}
