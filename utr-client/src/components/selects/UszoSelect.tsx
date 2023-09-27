import {GenericSelect} from "./GenericSelect";
import {useMemo} from "react";
import {UszoSelectProps} from "./UszoSelectProps";
import {useTranslation} from "../../hooks/translations";
import {Spinner} from "@material-tailwind/react";
import {useUszokList} from "../../hooks/uszok";

export function UszoSelect(props: UszoSelectProps) {
    const t = useTranslation();
    const [uszok, loadingUszok] = useUszokList(props.csapatId);

    const options = useMemo<{ [id: string]: string }>(() => {
        const out: { [id: string]: string } = {
            "NaN": "-"
        };

        uszok.forEach(value => {
            out[String(value.id)] = value.nev;
        });

        return out;
    }, [uszok]);

    return loadingUszok || !uszok ? (
        <Spinner/>
    ) : (
        <GenericSelect options={options}
                       label={t("generic_label.uszo")}
                       selected={String(props.selected)}
                       onSelect={value => {
                           props.onSelect(parseInt(value));
                       }}/>
    );
}
