import {GenericSelect} from "./GenericSelect";
import {useMemo} from "react";
import {CommonSelectProps} from "./CommonSelectProps";
import {useTranslation} from "../../hooks/translations";
import {Spinner} from "@material-tailwind/react";
import {useCsapatokList} from "../../hooks/csapatok";

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
        <Spinner/>
    ) : (
        <GenericSelect options={options}
                       label={t("generic_label.csapat")}
                       selected={String(props.selected)}
                       onSelect={value => {
                           props.onSelect(parseInt(value));
                       }}/>
    );
}
