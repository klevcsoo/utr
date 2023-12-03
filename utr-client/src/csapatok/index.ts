import {createContext} from "react";
import {RefreshableContext} from "../utils/types";
import {Csapat} from "./types";
import {Uszo} from "../uszok/types";

export const CsapatContext = createContext<RefreshableContext<{
    csapat: Csapat
    uszok: Uszo[]
}>>({
    uszok: undefined as any,
    csapat: undefined as any,
    refresh(): void {
    }
});
