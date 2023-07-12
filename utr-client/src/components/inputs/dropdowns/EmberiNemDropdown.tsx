import {EmberiNem} from "../../../types/EmberiNem";
import {useMemo} from "react";
import {GenericDropdown} from "./GenericDropdown";
import {CommonDropdownProps} from "../../../types/componentProps/common/CommonDropdownProps";
import {useTranslation} from "../../../hooks/translations/useTranslation";

export function EmberiNemDropdown(props: CommonDropdownProps<EmberiNem>) {
    const t = useTranslation();

    const options = useMemo<{ [key in EmberiNem]: string }>(() => {
        return {
            F: t("generic_label.male.emberi"),
            N: t("generic_label.female.emberi")
        };
    }, [t]);

    return (
        <GenericDropdown options={options}
                         selected={props.selected}
                         onSelect={props.onSelect}/>
    );
}
