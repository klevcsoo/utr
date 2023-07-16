import {Identifiable} from "../Identifiable";
import {EmberiNemId} from "../EmberiNemId";

export type Uszo = Identifiable<{
    csapatId: number
    nev: string
    szuletesiEv: number
    nem: EmberiNemId
}>
