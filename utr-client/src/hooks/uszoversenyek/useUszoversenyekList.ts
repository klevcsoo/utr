import {useCallback, useState} from "react";
import {useAuthUser} from "../auth/useAuthUser";
import {Uszoverseny} from "../../types/model/Uszoverseny";
import {getAllUszoversenyekList} from "../../api/uszoversenyek";
import {useApiPolling} from "../useApiPolling";

export function useUszoversenyekList(): [Uszoverseny[], boolean] {
    const user = useAuthUser();
    const [list, setList] = useState<Uszoverseny[]>([]);
    const [loading, setLoading] = useState(true);

    const doFetch = useCallback(() => {
        if (!!user) {
            getAllUszoversenyekList(user).then(response => {
                setList(response);
            }).catch(reason => {
                console.error(reason);
            }).finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(true);
        }
    }, [user]);

    useApiPolling(doFetch);

    return [list, loading];
}
