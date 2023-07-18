import {useContext} from "react";
import {TranslationContext} from "../../lib/translation";

export function useTranslation() {
    return useContext(TranslationContext).getTranslation;
}
