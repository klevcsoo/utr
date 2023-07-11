import {useContext} from "react";
import {TranslationContext} from "../../translation";

export function useTranslation() {
    return useContext(TranslationContext).getTranslation;
}
