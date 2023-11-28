import {useMemo} from "react";
import {GenericSelect} from "../../utils/components/selects/GenericSelect";
import {CommonSelectProps} from "../../utils/components/selects/CommonSelectProps";

import {useTranslation} from "../../translations/hooks";
import {useGetEmberiNemElnevezes} from "../../utils/hooks";
import {EmberiNemId} from "../types";

export function EmberiNemSelect(props: CommonSelectProps<EmberiNemId>) {
    const t = useTranslation();
    const getElnevezes = useGetEmberiNemElnevezes();

    const options = useMemo<{ [key in EmberiNemId]: string }>(() => {
        return {
            NEM_FERFI: getElnevezes("NEM_FERFI"),
            NEM_NO: getElnevezes("NEM_NO")
        };
    }, [getElnevezes]);

    return (
        <GenericSelect options={options}
                       label={t("generic_label.nem")}
                       selected={props.selected}
                       onSelect={props.onSelect}/>
    );
}
