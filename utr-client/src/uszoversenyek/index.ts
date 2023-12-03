import {createContext} from "react";
import {RefreshableContext} from "../utils/types";
import {Uszoverseny} from "./types";
import {Versenyszam} from "../versenyszamok/types";

export const UszoversenyContext = createContext<RefreshableContext<{
    uszoverseny: Uszoverseny
    versenyszamok: Versenyszam[]
}>>({
    uszoverseny: undefined as any,
    versenyszamok: undefined as any,
    refresh(): void {
    }
});
