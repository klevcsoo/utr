import {Locale} from "../types/Locale";
import {createContext} from "react";

export const TranslationContext = createContext<{
    getTranslation(key: string, ...args: string[]): string
    setLocale(locale: Locale): void
}>({
    getTranslation() {
        return "";
    },
    setLocale(): void {
    }
});

export async function loadTranslationMap(locale: Locale): Promise<Readonly<[string, string][]>> {
    const content = await fetch(`/translations/translations_${locale}.properties`, {
        headers: {
            "Content-Type": "text/plain; charset=UTF-8"
        }
    }).then(value => value.text());

    return content.trim().split("\n").map(line => {
        return line.split("=");
    }) as unknown as Readonly<[string, string][]>;
}
