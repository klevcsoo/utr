import {EmberiNemId} from "../EmberiNemId";
import {UszasnemId} from "../UszasnemId";

export type VersenyszamCreationData = {
    versenyId: number
    hossz: number
    uszasnemId: UszasnemId
    emberiNemId: EmberiNemId
    valto?: number
}
