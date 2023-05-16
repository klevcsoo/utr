import {useEffect, useState} from "react";
import {Versenyszam} from "../../types/Versenyszam";
import {Uszoverseny} from "../../types/Uszoverseny";
import {getOpenUszoverseny, getOpenVersenyszamok} from "../../api/nyitottVerseny";
import {useAuthUser} from "../auth/useAuthUser";

export function useNyitottVerseny():
    [(Uszoverseny & { versenyszamok: Versenyszam[] }) | undefined, boolean] {
    const {user} = useAuthUser();

    const [uszoverseny, setUszoverseny] = useState<Uszoverseny>();
    const [versenyszamok, setVersenyszamok] = useState<Versenyszam[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!!user) {
            getOpenUszoverseny(user).then(setUszoverseny).catch(reason => {
                console.error(reason);
            }).finally(() => setLoading(false));
            getOpenVersenyszamok(user).then(setVersenyszamok).catch(reason => {
                console.error(reason);
            }).finally(() => setLoading(false));
        }
    }, [user]);

    return [
        !uszoverseny ? undefined : {...uszoverseny, versenyszamok: versenyszamok},
        loading
    ];
}
