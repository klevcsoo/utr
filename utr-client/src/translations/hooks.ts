import {useCallback, useContext} from "react";
import {TranslationContext} from "../lib/translation";
import {Locale} from "../types/Locale";

export function useSetLocale() {
    const setLocale = useContext(TranslationContext).setLocale;

    return useCallback((locale: Locale) => {
        setLocale(locale);
    }, [setLocale]);
}

export function useTranslation() {
    return useContext(TranslationContext).getTranslation;
}
