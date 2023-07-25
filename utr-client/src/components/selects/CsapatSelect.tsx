import {GenericSelect} from "./GenericSelect";
import {useCsapatokList} from "../../hooks/csapatok/useCsapatokList";
import {LoadingSpinner} from "../LoadingSpinner";
import {useMemo} from "react";
import {CommonSelectProps} from "./CommonSelectProps";
import {useTranslation} from "../../hooks/translations/useTranslation";

export function CsapatSelect(props: CommonSelectProps<number>) {
    const t = useTranslation();
    const [csapatok, loadingCsapatok] = useCsapatokList();

    const options = useMemo<{ [id: string]: string }>(() => {
        const out: { [id: string]: string } = {
            "NaN": "-"
        };

        csapatok.forEach(value => {
            out[String(value.id)] = value.nev;
        });

        return out;
    }, [csapatok]);

    return loadingCsapatok || !csapatok ? (
        <LoadingSpinner scale={30}/>
    ) : (
        <GenericSelect options={options}
                       label={t("generic_label.csapat")}
                       selected={String(props.selected)}
                       onSelect={value => {
                           props.onSelect(parseInt(value));
                       }}/>
    );
}
