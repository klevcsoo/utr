import {useCallback, useState} from "react";
import {useAuthUser} from "../auth";
import {Nevezes} from "../../types/model/Nevezes";
import {getNevezes} from "../../api/nevezesek";
import {useApiPolling} from "..";

export default function useNevezesDetails(id: number): [Nevezes | undefined, boolean] {
    const user = useAuthUser();
    const [nevezes, setNevezes] = useState<Nevezes>();
    const [loading, setLoading] = useState(true);

    const doFetch = useCallback(() => {
        if (!!user && id !== -1) {
            getNevezes(id).then(setNevezes).catch(console.error).finally(() => {
                setLoading(false);
            });
        }
    }, [id, user]);

    useApiPolling(doFetch);

    return [nevezes, loading];
}
