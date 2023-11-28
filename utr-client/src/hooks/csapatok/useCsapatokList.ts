import {useCallback, useState} from "react";
import {Csapat} from "../../types/model/Csapat";
import {getAllCsapatokList} from "../../api/csapatok";
import {useAuthUser} from "../auth";
import {useApiPolling} from "..";

export default function useCsapatokList(): [Csapat[], boolean] {
    const user = useAuthUser();
    const [list, setList] = useState<Csapat[]>([]);
    const [loading, setLoading] = useState(true);

    const doFetch = useCallback(() => {
        if (!!user) {
            getAllCsapatokList().then(response => {
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
