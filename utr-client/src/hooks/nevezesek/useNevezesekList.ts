import {useCallback, useState} from "react";
import {useAuthUser} from "../auth/useAuthUser";
import {Nevezes} from "../../types/model/Nevezes";
import {getAllNevezesek} from "../../api/nevezesek";
import {useApiPolling} from "../useApiPolling";

export function useNevezesekList(versenyszamId: number | undefined): [Nevezes[], boolean] {
    const user = useAuthUser();
    const [list, setList] = useState<Nevezes[]>([]);
    const [loading, setLoading] = useState(true);

    const doFetch = useCallback(() => {
        if (!!versenyszamId && !!user) {
            getAllNevezesek(versenyszamId).then(setList).catch(reason => {
                console.error(reason);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [user, versenyszamId]);

    useApiPolling(doFetch);

    return [list, loading];
}
