import {Uszo} from "./model/Uszo";
import {Csapat} from "./model/Csapat";

export type DisplayedUszo = Omit<Uszo, "csapatId"> & {
    csapat: Csapat
}
