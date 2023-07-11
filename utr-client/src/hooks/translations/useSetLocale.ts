import {Locale} from "../../types/Locale";
import {useContext, useEffect} from "react";
import {TranslationContext} from "../../translation";

export function useSetLocale(locale: Locale) {
    const setLocale = useContext(TranslationContext).setLocale;

    useEffect(() => {
        setLocale(locale);
    }, [locale, setLocale]);
}
