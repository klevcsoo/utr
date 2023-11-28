import {useCallback, useEffect, useState} from "react";
import {loadTranslationMap, TranslationContext} from "../../utils/lib/translation";
import {CommonChildrenOnlyProps} from "../../utils/types";
import {Locale} from "../types";

const LOCALE_STORAGE_KEY = "locale";
{
    const initialLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (!initialLocale) {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, "hu");
    }
}

export function TranslationProvider(props: CommonChildrenOnlyProps) {
    const [translationMap, setTranslationMap] = useState<Readonly<{ [key: string]: string }>>();
    const [locale, setLocale] = useState<Locale>(
        window.localStorage.getItem(LOCALE_STORAGE_KEY)! as Locale
    );

    const doLoadTranslations = useCallback(() => {
        loadTranslationMap(locale).then(pairs => {
            const map: { [key: string]: string } = {};
            pairs.forEach(([key, value]) => map[key] = value);
            setTranslationMap(map);
        });
    }, [locale]);

    const doGetText = useCallback((key: string, ...args: string[]) => {
        if (!translationMap) {
            return key;
        }

        let text = translationMap[key];
        if (!text) {
            return key;
        }

        for (let i = 0; i < args.length; i++) {
            text = text.replaceAll(`{${i}}`, args[i]);
        }

        return text;
    }, [translationMap]);

    useEffect(() => {
        doLoadTranslations();
    }, [doLoadTranslations]);

    useEffect(() => {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    }, [locale]);

    return (
        <TranslationContext.Provider value={{
            getTranslation: doGetText,
            setLocale: setLocale
        }}>
            {props.children}
        </TranslationContext.Provider>
    );
}
