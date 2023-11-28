import {useCallback, useEffect, useState} from "react";
import {useAuthUser} from "../auth/useAuthUser";
import {Versenyszam} from "../../types/model/Versenyszam";
import {getVersenyszam} from "../../api/versenyszamok";
import {RefreshableLiveData} from "../../types/RefreshableLiveData";

export function useVersenyszamDetails(id: number): RefreshableLiveData<Versenyszam> {
    const user = useAuthUser();
    const [uszo, setUszo] = useState<Versenyszam>();
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        if (!!user && id !== -1) {
            getVersenyszam(user, id).then(setUszo).catch(console.error).finally(() => {
                setLoading(false);
            });
        }
    }, [id, user]);

    useEffect(refresh, [refresh]);

    return [uszo, loading, refresh];
}
