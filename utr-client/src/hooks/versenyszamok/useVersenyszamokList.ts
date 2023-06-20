import {useEffect, useState} from "react";
import {useAuthUser} from "../auth/useAuthUser";
import {Versenyszam} from "../../types/model/Versenyszam";
import {getVersenyszamokInVerseny} from "../../api/versenyszamok";

export function useVersenyszamokList(uszoversenyId: number | undefined): [Versenyszam[], boolean] {
    const user = useAuthUser();
    const [list, setList] = useState<Versenyszam[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!!uszoversenyId && !!user) {
            getVersenyszamokInVerseny(user, uszoversenyId).then(setList).catch(reason => {
                console.error(reason);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [user, uszoversenyId]);

    return [list, loading];
}
