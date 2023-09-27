import {useCallback, useState} from "react";
import {Uszo} from "../../types/model/Uszo";
import {useAuthUser} from "../auth";
import {getUszo} from "../../api/uszok";
import {useApiPolling} from "..";

export default function useUszoDetails(id: number): [Uszo | undefined, boolean] {
    const user = useAuthUser();
    const [uszo, setUszo] = useState<Uszo>();
    const [loading, setLoading] = useState(true);

    const doFetch = useCallback(() => {
        if (!!user && id !== -1) {
            getUszo(id).then(setUszo).catch(console.error).finally(() => {
                setLoading(false);
            });
        }
    }, [id, user]);

    useApiPolling(doFetch);

    return [uszo, loading];
}
