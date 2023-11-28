import {Identifiable} from "../utils/types";

export type Uszoverseny = Identifiable<{
    nev: string
    helyszin?: string
    datum: Date
    nyitott: boolean
}>
