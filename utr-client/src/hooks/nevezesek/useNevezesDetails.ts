import {useCallback, useEffect, useState} from "react";
import {useAuthUser} from "../auth/useAuthUser";
import {Nevezes} from "../../types/model/Nevezes";
import {getNevezes} from "../../api/nevezesek";
import {RefreshableLiveData} from "../../types/RefreshableLiveData";

export function useNevezesDetails(id: number): RefreshableLiveData<Nevezes> {
    const user = useAuthUser();
    const [nevezes, setNevezes] = useState<Nevezes>();
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        if (!!user && id !== -1) {
            getNevezes(user, id).then(setNevezes).catch(console.error).finally(() => {
                setLoading(false);
            });
        }
    }, [id, user]);

    useEffect(refresh, [refresh]);

    return [nevezes, loading, refresh];
}
