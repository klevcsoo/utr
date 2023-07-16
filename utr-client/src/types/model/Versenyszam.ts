import {Identifiable} from "../Identifiable";
import {EmberiNemId} from "../EmberiNemId";
import {UszasnemId} from "../UszasnemId";

export type Versenyszam = Identifiable<{
    versenyId: number
    hossz: number
    uszasnem: UszasnemId
    nem: EmberiNemId
    valto?: number
}>
