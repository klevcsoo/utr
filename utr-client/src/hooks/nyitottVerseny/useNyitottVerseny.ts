import {useCallback, useEffect, useState} from "react";
import {Versenyszam} from "../../types/model/Versenyszam";
import {Uszoverseny} from "../../types/model/Uszoverseny";
import {getOpenUszoverseny, getOpenVersenyszamok} from "../../api/nyitottVerseny";
import {useAuthUser} from "../auth/useAuthUser";
import {RefreshableLiveData} from "../../types/RefreshableLiveData";

export function useNyitottVerseny():
    RefreshableLiveData<(Uszoverseny & { versenyszamok: Versenyszam[] })> {
    const user = useAuthUser();

    const [uszoverseny, setUszoverseny] = useState<Uszoverseny>();
    const [versenyszamok, setVersenyszamok] = useState<Versenyszam[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        if (!!user) {
            getOpenUszoverseny(user).then(setUszoverseny).catch(reason => {
                console.error(reason);
            }).finally(() => setLoading(false));
            getOpenVersenyszamok(user).then(setVersenyszamok).catch(reason => {
                console.error(reason);
            }).finally(() => setLoading(false));
        }
    }, [user]);

    useEffect(refresh, [refresh]);

    return [
        !uszoverseny ? undefined : {...uszoverseny, versenyszamok: versenyszamok},
        loading,
        refresh
    ];
}
