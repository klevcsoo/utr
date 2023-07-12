import {EmberiNem} from "../../../types/EmberiNem";
import {useMemo} from "react";
import {GenericDropdown} from "./GenericDropdown";
import {CommonDropdownProps} from "../../../types/componentProps/common/CommonDropdownProps";
import {useTranslation} from "../../../hooks/translations/useTranslation";

export function VersenyszamNemDropdown(props: CommonDropdownProps<EmberiNem>) {
    const t = useTranslation();

    const options = useMemo<{ [key in EmberiNem]: string }>(() => {
        return {
            F: t("generic_label.male.versenyszam")!,
            N: t("generic_label.female.versenyszam")!
        };
    }, [t]);

    return (
        <GenericDropdown options={options}
                         selected={props.selected}
                         onSelect={props.onSelect}/>
    );
}
