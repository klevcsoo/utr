import {DisplayedUszo} from "../DisplayedUszo";
import {Identifiable} from "../Identifiable";

export type Nevezes = Identifiable<{
    uszo: DisplayedUszo
    versenyszamId: number
    nevezesiIdo: number
    idoeredmeny: number
    megjelent: boolean
}>
