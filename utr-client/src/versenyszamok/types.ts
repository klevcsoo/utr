import {Identifiable} from "../utils/types";

import {EmberiNemId} from "../uszok/types";

export type UszasnemId = "USZASNEM_GYORS" | "USZASNEM_MELL" | "USZASNEM_HAT" | "USZASNEM_PILLANGO"
export type Versenyszam = Identifiable<{
    versenyId: number
    hossz: number
    uszasnem: UszasnemId
    nem: EmberiNemId
    valto?: number
}>
export type VersenyszamCreationData = {
    versenyId: number
    hossz: number
    uszasnemId: UszasnemId
    emberiNemId: EmberiNemId
    valto?: number
}
export type DisplayedVersenyszam = {
    id: number
    hossz: `${number}m`
    uszasnem: string
    nem: string
    valto: `${number}x` | ""
}
