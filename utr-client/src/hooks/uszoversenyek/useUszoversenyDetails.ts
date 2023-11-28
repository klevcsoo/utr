import {useCallback, useEffect, useState} from "react";
import {useAuthUser} from "../auth/useAuthUser";
import {Uszoverseny} from "../../types/model/Uszoverseny";
import {getUszoverseny} from "../../api/uszoversenyek";
import {RefreshableLiveData} from "../../types/RefreshableLiveData";

export function useUszoversenyDetails(id: number): RefreshableLiveData<Uszoverseny> {
    const user = useAuthUser();
    const [uszoverseny, setUszoverseny] = useState<Uszoverseny>();
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        if (!!user && id !== -1) {
            getUszoverseny(user, id).then(setUszoverseny).catch(console.error).finally(() => {
                setLoading(false);
            });
        }
    }, [id, user]);

    useEffect(refresh, [refresh]);

    return [uszoverseny, loading, refresh];
}
