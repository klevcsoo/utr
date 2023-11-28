import {useCallback, useEffect, useState} from "react";
import {Nevezes} from "../../types/model/Nevezes";
import {getAllNevezesek} from "../../api/nevezesek";
import {RefreshableLiveData} from "../../types/RefreshableLiveData";
import {useAuthUser} from "../../auth/hooks";

export function useNevezesekList(
    versenyszamId: number | undefined
): RefreshableLiveData<Nevezes[]> {
    const user = useAuthUser();
    const [list, setList] = useState<Nevezes[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        if (!!versenyszamId && !!user) {
            getAllNevezesek(user, versenyszamId).then(setList).catch(reason => {
                console.error(reason);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [user, versenyszamId]);

    useEffect(refresh, [refresh]);

    return [list, loading, refresh];
}
