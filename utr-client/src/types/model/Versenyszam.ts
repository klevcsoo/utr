import {Uszasnem} from "./Uszasnem";
import {Identifiable} from "../Identifiable";
import {EmberiNem} from "../EmberiNem";

export type Versenyszam = Identifiable<{
    versenyId: number
    hossz: number
    uszasnem: Uszasnem
    nem: EmberiNem
    valto?: number
}>
