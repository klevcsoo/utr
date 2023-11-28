import {Fragment} from "react";
import {useTranslation} from "../../translations/hooks";
import {NumberInput} from "../../utils/components/inputs/NumberInput";
import {VersenyszamNemSelect} from "./VersenyszamNemSelect";
import {UszasnemSelect} from "./UszasnemSelect";
import {EmberiNemId} from "../../uszok/types";
import {UszasnemId} from "../types";

export interface VersenyszamEditLayoutProps {
    valto: number;
    hossz: number;
    versenyszamNem: EmberiNemId;
    uszasnem: UszasnemId;

    setValto(value: number): void;

    setHossz(value: number): void;

    setVersenyszamNem(value: EmberiNemId): void;

    setUszasnem(value: UszasnemId): void;
}

export function VersenyszamEditLayout(props: VersenyszamEditLayoutProps) {
    const t = useTranslation();

    return (
        <Fragment>
            <NumberInput value={props.valto} onValue={props.setValto}
                         label={t("generic_label.valto")}/>
            <NumberInput value={props.hossz} onValue={props.setHossz} min={25} max={200}
                         label={t("versenyszam.hossz")}/>
            <VersenyszamNemSelect selected={props.versenyszamNem}
                                  onSelect={props.setVersenyszamNem}/>
            <UszasnemSelect selected={props.uszasnem} onSelect={props.setUszasnem}/>
        </Fragment>
    );
}
