import {useCallback, useState} from "react";
import {useAuthUser} from "../auth";
import {Uszoverseny} from "../../types/model/Uszoverseny";
import {getAllUszoversenyekList} from "../../api/uszoversenyek";
import {useApiPolling} from "..";

export default function useUszoversenyekList(): [Uszoverseny[], boolean] {
    const user = useAuthUser();
    const [list, setList] = useState<Uszoverseny[]>([]);
    const [loading, setLoading] = useState(true);

    const doFetch = useCallback(() => {
        if (!!user) {
            getAllUszoversenyekList().then(response => {
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
