import {useTranslation} from "./translations/useTranslation";
import {useMemo} from "react";

export function useEmberiNemDropdownList(): Readonly<string[]> {
    const t = useTranslation();

    // noinspection SpellCheckingInspection
    return useMemo<Readonly<string[]>>(() => [
        "-",
        t("generic_label.male.emberi"),
        t("generic_label.female.emberi")
    ] as Readonly<string[]>, [t]);
}
