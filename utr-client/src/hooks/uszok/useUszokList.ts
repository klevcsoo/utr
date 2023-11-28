import {Uszo} from "../../types/model/Uszo";
import {useCallback, useEffect, useState} from "react";
import {useAuthUser} from "../auth/useAuthUser";
import {getAllUszokInCsapat} from "../../api/uszok";
import {RefreshableLiveData} from "../../types/RefreshableLiveData";

export function useUszokList(csapatId: number | undefined): RefreshableLiveData<Uszo[]> {
    const user = useAuthUser();
    const [list, setList] = useState<Uszo[]>([]);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(() => {
        if (!!csapatId && !!user) {
            getAllUszokInCsapat(user, csapatId).then(setList).catch(reason => {
                console.error(reason);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [user, csapatId]);

    useEffect(refresh, [refresh]);

    return [list, loading, refresh];
}
