import {createContext} from "react";
import {Uszoverseny} from "../uszoversenyek/types";
import {Csapat} from "../csapatok/types";
import {RefreshableContext} from "../utils/types";

export const OrganisationContext = createContext<RefreshableContext<{
    uszoversenyek: Uszoverseny[]
    nyitottUszoverseny: Uszoverseny | undefined
    csapatok: Csapat[]
}>>({
    csapatok: undefined as any,
    nyitottUszoverseny: undefined as any,
    uszoversenyek: undefined as any,
    refresh(): void {
    }
});
