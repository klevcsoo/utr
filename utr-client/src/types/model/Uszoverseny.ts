import {Identifiable} from "../Identifiable";

export type Uszoverseny = Identifiable<{
    nev: string
    helyszin?: string
    datum: Date
    nyitott: boolean
}>
