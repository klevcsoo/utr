export type Versenyszam = {
    id: number
    versenyId: number
    hossz: number
    uszasnem: {
        id: number
        elnevezes: string
    }
    nem: string
    valto?: number
}
