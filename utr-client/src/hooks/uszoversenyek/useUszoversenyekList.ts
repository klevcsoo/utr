import {useCallback, useEffect, useState} from "react";
import {useAuthUser} from "../auth/useAuthUser";
import {Uszoverseny} from "../../types/model/Uszoverseny";
import {getAllUszoversenyekList} from "../../api/uszoversenyek";
import {RefreshableLiveData} from "../../types/RefreshableLiveData";

export function useUszoversenyekList(): RefreshableLiveData<Uszoverseny[]> {
    const user = useAuthUser();
    const [list, setList] = useState<Uszoverseny[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
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

    useEffect(refresh, [refresh]);

    return [list, loading, refresh];
}
