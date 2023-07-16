import {useCallback, useState} from "react";
import {useAuthUser} from "../auth/useAuthUser";
import {Versenyszam} from "../../types/model/Versenyszam";
import {getVersenyszamokInVerseny} from "../../api/versenyszamok";
import {useApiPolling} from "../useApiPolling";

export function useVersenyszamokList(uszoversenyId: number | undefined): [Versenyszam[], boolean] {
    const user = useAuthUser();
    const [list, setList] = useState<Versenyszam[]>([]);
    const [loading, setLoading] = useState(false);

    const doFetch = useCallback(() => {
        if (!!uszoversenyId && !!user) {
            getVersenyszamokInVerseny(user, uszoversenyId).then(setList).catch(reason => {
                console.error(reason);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [user, uszoversenyId]);

    useApiPolling(doFetch);

    return [list, loading];
}
