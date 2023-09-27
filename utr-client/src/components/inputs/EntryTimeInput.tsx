import {Checkbox} from "@material-tailwind/react";
import {IntervalMaskedInput} from "./IntervalMaskedInput";
import {useEffect, useState} from "react";
import {useTranslation} from "../../hooks/translations";

export interface EntryTimeInputProps {
    value: string | undefined;

    onValue(value: string | undefined): void;
}

export function EntryTimeInput(props: EntryTimeInputProps) {
    const t = useTranslation();

    const [enabled, setEnabled] = useState(props.value !== undefined);
    const [time, setTime] = useState(props.value ?? "");

    useEffect(() => {
        setEnabled(props.value !== undefined);
        setTime(props.value ?? "");
    }, [props.value]);

    return (
        <div className="flex flex-row gap-2 justify-items-start items-center">
            <Checkbox checked={enabled} onChange={event => {
                setEnabled(event.currentTarget.checked);
            }}/>
            <IntervalMaskedInput value={time}
                                 onValue={setTime}
                                 disabled={!enabled}
                                 label={t("generic_label.nevezesi_ido")}/>
        </div>
    );
}
