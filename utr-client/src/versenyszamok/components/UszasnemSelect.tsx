import {useMemo} from "react";
import {GenericSelect} from "../../utils/components/selects/GenericSelect";
import {CommonSelectProps} from "../../utils/components/selects/CommonSelectProps";

import {useTranslation} from "../../translations/hooks";
import {useGetUszasnemElnevezes} from "../../utils/hooks";
import {UszasnemId} from "../types";

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