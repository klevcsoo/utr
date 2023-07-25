import {useMemo} from "react";
import {GenericSelect} from "./GenericSelect";
import {UszasnemId} from "../../types/UszasnemId";
import {CommonSelectProps} from "./CommonSelectProps";
import {useGetUszasnemElnevezes} from "../../hooks/useGetUszasnemElnevezes";
import {useTranslation} from "../../hooks/translations/useTranslation";

export function UszasnemSelect(props: CommonSelectProps<UszasnemId>) {
    const t = useTranslation();
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
        <GenericSelect options={options}
                       label={t("generic_label.uszasnem")}
                       selected={props.selected}
                       onSelect={props.onSelect}/>
    );
}
