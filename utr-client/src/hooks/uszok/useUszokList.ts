import {Uszo} from "../../types/model/Uszo";
import {useCallback, useState} from "react";
import {useAuthUser} from "../auth/useAuthUser";
import {getAllUszokInCsapat} from "../../api/uszok";
import {useApiPolling} from "../useApiPolling";

export function useUszokList(csapatId: number | undefined): [Uszo[], boolean] {
    const user = useAuthUser();
    const [list, setList] = useState<Uszo[]>([]);
    const [loading, setLoading] = useState(false);

    const doFetch = useCallback(() => {
        if (!!csapatId && !!user) {
            getAllUszokInCsapat(user, csapatId).then(setList).catch(reason => {
                console.error(reason);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [user, csapatId]);

    useApiPolling(doFetch);

    return [list, loading];
}
