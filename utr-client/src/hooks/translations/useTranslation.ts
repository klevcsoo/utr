import {useContext} from "react";
import {TranslationContext} from "../../lib/translation";

export default function useTranslation() {
    return useContext(TranslationContext).getTranslation;
}
