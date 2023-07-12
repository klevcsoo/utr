import {useCallback, useState} from "react";
import {Uszo} from "../../types/model/Uszo";
import {useAuthUser} from "../auth/useAuthUser";
import {getUszo} from "../../api/uszok";
import {useApiPolling} from "../useApiPolling";

export function useUszoDetails(id: number): [Uszo | undefined, boolean] {
    const user = useAuthUser();
    const [uszo, setUszo] = useState<Uszo>();
    const [loading, setLoading] = useState(true);

    const doFetch = useCallback(() => {
        if (!!user && id !== -1) {
            getUszo(user, id).then(setUszo).catch(console.error).finally(() => {
                setLoading(false);
            });
        }
    }, [id, user]);

    useApiPolling(doFetch);

    return [uszo, loading];
}
