import {EmberiNemId} from "../EmberiNemId";

export type VersenyszamCreationData = {
    versenyId: number
    hossz: number
    uszasnemId: number
    emberiNemId: EmberiNemId
    valto?: number
}
