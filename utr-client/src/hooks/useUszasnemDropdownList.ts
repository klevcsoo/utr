import {useTranslation} from "./translations/useTranslation";
import {useMemo} from "react";

export function useUszasnemDropdownList(): Readonly<string[]> {
    const t = useTranslation();

    // noinspection SpellCheckingInspection
    return useMemo<Readonly<string[]>>(() => [
        "-",
        t("generic_label.uszasnem.gyorsuszas"),
        t("generic_label.uszasnem.melluszas"),
        t("generic_label.uszasnem.hatuszas"),
        t("generic_label.uszasnem.pillangouszas")
    ] as Readonly<string[]>, [t]);
}
