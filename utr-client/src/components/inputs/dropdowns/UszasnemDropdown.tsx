import {useMemo} from "react";
import {GenericDropdown} from "./GenericDropdown";
import {UszasnemElnevezes} from "../../../types/UszasnemElnevezes";
import {CommonDropdownProps} from "../../../types/componentProps/common/CommonDropdownProps";
import {useTranslation} from "../../../hooks/translations/useTranslation";

export function UszasnemDropdown(props: CommonDropdownProps<UszasnemElnevezes>) {
    const t = useTranslation();

    const options = useMemo<UszasnemElnevezes[]>(() => {
        // noinspection SpellCheckingInspection
        return [
            t("generic_label.uszasnem.gyorsuszas")! as UszasnemElnevezes,
            t("generic_label.uszasnem.melluszas")! as UszasnemElnevezes,
            t("generic_label.uszasnem.hatuszas")! as UszasnemElnevezes,
            t("generic_label.uszasnem.pillangouszas")! as UszasnemElnevezes
        ];
    }, [t]);

    return (
        <GenericDropdown options={options}
                         selected={props.selected}
                         onSelect={props.onSelect}/>
    );
}
