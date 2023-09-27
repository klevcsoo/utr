import {useCallback, useState} from "react";
import {Versenyszam} from "../../types/model/Versenyszam";
import {Uszoverseny} from "../../types/model/Uszoverseny";
import {getOpenUszoverseny, getOpenVersenyszamok} from "../../api/nyitottVerseny";
import {useAuthUser} from "../auth/useAuthUser";
import {useApiPolling} from "../useApiPolling";

export function useNyitottVerseny():
    [(Uszoverseny & { versenyszamok: Versenyszam[] }) | undefined, boolean] {
    const user = useAuthUser();

    const [uszoverseny, setUszoverseny] = useState<Uszoverseny>();
    const [versenyszamok, setVersenyszamok] = useState<Versenyszam[]>([]);
    const [loading, setLoading] = useState(true);

    const doFetch = useCallback(() => {
        if (!!user) {
            getOpenUszoverseny().then(setUszoverseny).catch(reason => {
                console.error(reason);
            }).finally(() => setLoading(false));
            getOpenVersenyszamok().then(setVersenyszamok).catch(reason => {
                console.error(reason);
            }).finally(() => setLoading(false));
        }
    }, [user]);

    useApiPolling(doFetch);

    return [
        !uszoverseny ? undefined : {...uszoverseny, versenyszamok: versenyszamok},
        loading
    ];
}
