import {useMemo} from "react";
import {Chip} from "@material-tailwind/react";
import {useTranslation} from "../hooks/translations";

export interface DateChipProps {
    date: number | Date;
}

export function DateChip(props: DateChipProps) {
    const t = useTranslation();

    const date = useMemo(() => {
        return props.date instanceof Date ? props.date : new Date(props.date);
    }, [props.date]);

    const isToday = useMemo(() => {
        return date.toLocaleDateString() === new Date().toLocaleDateString();
    }, [date]);

    const formattedDate = useMemo<string>(() => {
        if (isToday) {
            return t("generic_label.date.today");
        } else {
            return date.toLocaleDateString();
        }
    }, [date, isToday, t]);

    return (
        <Chip value={formattedDate} variant="ghost" className="w-min"
              color={isToday ? "deep-purple" : "blue"}/>
    );
}
