import {useMemo} from "react";
import {GenericSelect} from "../../utils/components/selects/GenericSelect";
import {CommonSelectProps} from "../../utils/components/selects/CommonSelectProps";

import {useTranslation} from "../../translations/hooks";
import {useGetVersenyszamNemElnevezes} from "../../utils/hooks";
import {EmberiNemId} from "../../uszok/types";

export function VersenyszamNemSelect(props: CommonSelectProps<EmberiNemId>) {
    const t = useTranslation();
    const getElnevezes = useGetVersenyszamNemElnevezes();

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
