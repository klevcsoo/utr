import {useCallback, useState} from "react";
import {useAuthUser} from "../auth/useAuthUser";
import {Uszoverseny} from "../../types/model/Uszoverseny";
import {getUszoverseny} from "../../api/uszoversenyek";
import {useApiPolling} from "../useApiPolling";

export function useUszoversenyDetails(id: number): [Uszoverseny | undefined, boolean] {
    const user = useAuthUser();
    const [uszoverseny, setUszoverseny] = useState<Uszoverseny>();
    const [loading, setLoading] = useState(true);

    const doFetch = useCallback(() => {
        if (!!user && id !== -1) {
            getUszoverseny(user, id).then(setUszoverseny).catch(console.error).finally(() => {
                setLoading(false);
            });
        }
    }, [id, user]);

    useApiPolling(doFetch);

    return [uszoverseny, loading];
}
