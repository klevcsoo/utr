import {createContext} from "react";
import {RefreshableContext} from "../utils/types";
import {Versenyszam} from "./types";
import {Nevezes} from "../nevezesek/types";

export const VersenyszamContext = createContext<RefreshableContext<{
    versenyszam: Versenyszam,
    nevezesek: Nevezes[]
}>>({
    versenyszam: undefined as any,
    nevezesek: undefined as any,
    refresh(): void {
    }
});
