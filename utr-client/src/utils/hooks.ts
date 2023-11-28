import {useCallback, useContext, useEffect, useMemo} from "react";
import {offApiPollEvent, onApiPollEvent} from "./lib/apiPolling";
import {useTranslation} from "../translations/hooks";
import {EmberiNemId} from "../types/EmberiNemId";
import {UszasnemId} from "../types/UszasnemId";
import {AdminLayoutTitleContext} from "./components/AdminLayout";

export function useApiPolling(fetchCallback: () => void) {
    useEffect(() => {
        onApiPollEvent(fetchCallback);
        return () => offApiPollEvent(fetchCallback);
    }, [fetchCallback]);
}

export function useEmberiNemDropdownList(): Readonly<string[]> {
    const t = useTranslation();

    // noinspection SpellCheckingInspection
    return useMemo<Readonly<string[]>>(() => [
        "-",
        t("generic_label.male.emberi"),
        t("generic_label.female.emberi")
    ] as Readonly<string[]>, [t]);
}

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

export function useGetUszasnemElnevezes() {
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

export function useSetAdminLayoutTitle(title: string, disableNavigation?: boolean) {
    const setTitle = useContext(AdminLayoutTitleContext);

    useEffect(() => {
        setTitle(title, disableNavigation);
    }, [setTitle, title, disableNavigation]);
}

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
