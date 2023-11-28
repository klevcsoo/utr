import {useCallback, useEffect, useState} from "react";
import {Versenyszam} from "../../types/model/Versenyszam";
import {getVersenyszam} from "../../api/versenyszamok";
import {RefreshableLiveData} from "../../types/RefreshableLiveData";
import {useAuthUser} from "../../auth/hooks";

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
