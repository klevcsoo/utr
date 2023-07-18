import {Locale} from "../../types/Locale";
import {useCallback, useContext} from "react";
import {TranslationContext} from "../../lib/translation";

export function useSetLocale() {
    const setLocale = useContext(TranslationContext).setLocale;

    return useCallback((locale: Locale) => {
        setLocale(locale);
    }, [setLocale]);
}
