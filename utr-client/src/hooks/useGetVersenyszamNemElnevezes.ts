import {useTranslation} from "./translations/useTranslation";
import {useCallback, useMemo} from "react";
import {EmberiNemId} from "../types/EmberiNemId";

export function useGetVersenyszamNemElnevezes() {
    const t = useTranslation();

    const elnevezesMap = useMemo<{ [key in EmberiNemId]: string }>(() => {
        return {
            NEM_FERFI: t("generic_label.male.versenyszam"),
            NEM_NO: t("generic_label.female.versenyszam")
        };
    }, [t]);

    return useCallback((id: EmberiNemId) => {
        return elnevezesMap[id];
    }, [elnevezesMap]);
}
