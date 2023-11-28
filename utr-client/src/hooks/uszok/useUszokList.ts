import {Uszo} from "../../types/model/Uszo";
import {useCallback, useState} from "react";
import {useAuthUser} from "../auth";
import {getAllUszokInCsapat} from "../../api/uszok";
import {useApiPolling} from "..";

export default function useUszokList(csapatId: number | undefined): [Uszo[], boolean] {
    const user = useAuthUser();
    const [list, setList] = useState<Uszo[]>([]);
    const [loading, setLoading] = useState(false);

    const doFetch = useCallback(() => {
        if (!!csapatId && !!user) {
            getAllUszokInCsapat(csapatId).then(setList).catch(reason => {
                console.error(reason);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [user, csapatId]);

    useApiPolling(doFetch);

    return [list, loading];
}
