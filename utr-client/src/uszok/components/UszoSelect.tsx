import {GenericSelect} from "../../utils/components/selects/GenericSelect";
import {useMemo} from "react";
import {Spinner} from "@material-tailwind/react";
import {useTranslation} from "../../translations/hooks";
import {useUszokList} from "../hooks";
import {CommonSelectProps} from "../../utils/components/selects/CommonSelectProps";

export interface UszoSelectProps extends CommonSelectProps<number | undefined> {
    csapatId: number | undefined;
}

export function UszoSelect(props: UszoSelectProps) {
    const t = useTranslation();
    const [uszok, loadingUszok] = useUszokList(props.csapatId);

    const options = useMemo<{ [id: string]: string }>(() => {
        const out: { [id: string]: string } = {};

        uszok.forEach(value => {
            out[String(value.id)] = value.nev;
        });

        return out;
    }, [uszok]);

    return loadingUszok ? <Spinner/> : (
        <GenericSelect options={options}
                       label={t("generic_label.uszo")}
                       selected={String(props.selected)}
                       disabled={props.disabled}
                       onSelect={value => {
                           props.onSelect(parseInt(value));
                       }}/>
    );
}
