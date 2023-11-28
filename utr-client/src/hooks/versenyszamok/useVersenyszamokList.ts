import {useCallback, useEffect, useState} from "react";
import {Versenyszam} from "../../types/model/Versenyszam";
import {getVersenyszamokInVerseny} from "../../api/versenyszamok";
import {RefreshableLiveData} from "../../types/RefreshableLiveData";
import {useAuthUser} from "../../auth/hooks";

export function useVersenyszamokList(
    uszoversenyId: number | undefined
): RefreshableLiveData<Versenyszam[]> {
    const user = useAuthUser();
    const [list, setList] = useState<Versenyszam[]>([]);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(() => {
        if (!!uszoversenyId && !!user) {
            getVersenyszamokInVerseny(user, uszoversenyId).then(setList).catch(reason => {
                console.error(reason);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [user, uszoversenyId]);

    useEffect(refresh, [refresh]);

    return [list, loading, refresh];
}
