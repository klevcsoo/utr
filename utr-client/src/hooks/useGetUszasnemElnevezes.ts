import {useTranslation} from "./translations";
import {useCallback, useMemo} from "react";
import {UszasnemId} from "../types/UszasnemId";

export default function useGetUszasnemElnevezes() {
    const t = useTranslation();

    const elnevezesMap = useMemo<{ [key in UszasnemId]: string }>(() => {
        return {
            USZASNEM_GYORS: t("generic_label.uszasnem.gyorsuszas"),
            USZASNEM_MELL: t("generic_label.uszasnem.melluszas"),
            USZASNEM_HAT: t("generic_label.uszasnem.hatuszas"),
            USZASNEM_PILLANGO: t("generic_label.uszasnem.pillangouszas")
        };
    }, [t]);

    return useCallback((id: UszasnemId) => {
        return elnevezesMap[id];
    }, [elnevezesMap]);
}
