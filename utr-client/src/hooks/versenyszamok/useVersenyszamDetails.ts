import {useCallback, useState} from "react";
import {useAuthUser} from "../auth/useAuthUser";
import {Versenyszam} from "../../types/model/Versenyszam";
import {getVersenyszam} from "../../api/versenyszamok";
import {useApiPolling} from "../useApiPolling";

export function useVersenyszamDetails(id: number): [Versenyszam | undefined, boolean] {
    const user = useAuthUser();
    const [uszo, setUszo] = useState<Versenyszam>();
    const [loading, setLoading] = useState(true);

    const doFetch = useCallback(() => {
        if (!!user && id !== -1) {
            getVersenyszam(id).then(setUszo).catch(console.error).finally(() => {
                setLoading(false);
            });
        }
    }, [id, user]);

    useApiPolling(doFetch);

    return [uszo, loading];
}
