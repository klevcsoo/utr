import {useEffect, useState} from "react";
import {Versenyszam} from "../types/Versenyszam";
import {Uszoverseny} from "../types/Uszoverseny";
import {getOpenUszoverseny, getOpenVersenyszamok} from "../api/nyitottVerseny";
import {useAuthUser} from "./useAuthUser";

export function useNyitottVerseny():
    (Uszoverseny & { versenyszamok: Versenyszam[] }) | undefined {
    const {user} = useAuthUser();

    const [uszoverseny, setUszoverseny] = useState<Uszoverseny>();
    const [versenyszamok, setVersenyszamok] = useState<Versenyszam[]>([]);

    useEffect(() => {
        if (!!user) {
            getOpenUszoverseny(user).then(setUszoverseny);
            getOpenVersenyszamok(user).then(setVersenyszamok);
        }
    }, [user]);

    return !uszoverseny ? undefined : {...uszoverseny, versenyszamok: versenyszamok};
}
