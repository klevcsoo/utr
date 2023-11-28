import {useCallback, useEffect, useState} from "react";
import {Csapat} from "../../types/model/Csapat";
import {getAllCsapatokList} from "../../api/csapatok";
import {useAuthUser} from "../auth/useAuthUser";
import {RefreshableLiveData} from "../../types/RefreshableLiveData";

export function useCsapatokList(): RefreshableLiveData<Csapat[]> {
    const user = useAuthUser();
    const [list, setList] = useState<Csapat[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        if (!!user) {
            getAllCsapatokList(user).then(response => {
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

    useEffect(refresh, [refresh]);

    return [list, loading, refresh];
}
