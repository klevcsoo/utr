import {Identifiable} from "../utils/types";

import {DisplayedUszo} from "../uszok/types";

export type Nevezes = Identifiable<{
    uszo: DisplayedUszo
    versenyszamId: number
    nevezesiIdo: number
    idoeredmeny: number
    megjelent: boolean
}>

export interface NevezesEditData {
    csapatId: number | undefined;
    uszoId: number | undefined;
    nevezesiIdo: string;
}

export type NevezesCreationData = {
    versenyszamId: number
    uszoId: number
    megjelent: boolean
    nevezesiIdo?: string
}

export type DisplayedNevezes = Identifiable<{
    uszoNev: string
    uszoSzuletesiEv: number
    csapatNev: string
    nevezesiIdo: string
    idoeredmeny: string
    megjelent: boolean
}>
