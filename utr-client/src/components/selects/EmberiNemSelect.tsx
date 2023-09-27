import {EmberiNemId} from "../../types/EmberiNemId";
import {useMemo} from "react";
import {GenericSelect} from "./GenericSelect";
import {CommonSelectProps} from "./CommonSelectProps";
import {useTranslation} from "../../hooks/translations";
import {useGetEmberiNemElnevezes} from "../../hooks";

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
