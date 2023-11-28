import {useCallback, useMemo} from "react";
import {EmberiNemId} from "../types/EmberiNemId";
import {useTranslation} from "../translations/hooks";

export function useGetEmberiNemElnevezes() {
    const t = useTranslation();

    const elnevezesMap = useMemo<{ [key in EmberiNemId]: string }>(() => {
        return {
            NEM_FERFI: t("generic_label.male.emberi"),
            NEM_NO: t("generic_label.female.emberi")
        };
    }, [t]);

    return useCallback((id: EmberiNemId) => {
        return elnevezesMap[id];
    }, [elnevezesMap]);
}
