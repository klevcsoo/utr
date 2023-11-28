import {Identifiable} from "../utils/types";
import {Csapat} from "../csapatok/types";

export type EmberiNemId = "NEM_FERFI" | "NEM_NO";
export type Uszo = Identifiable<{
    csapatId: number
    nev: string
    szuletesiEv: number
    nem: EmberiNemId
}>
export type DisplayedUszo = Omit<Uszo, "csapatId"> & {
    csapat: Csapat
}
