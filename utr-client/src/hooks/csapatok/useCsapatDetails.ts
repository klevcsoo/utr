import {Csapat} from "../../types/model/Csapat";
import {useCallback, useState} from "react";
import {getCsapat} from "../../api/csapatok";
import {useApiPolling} from "..";
import {useAuthUser} from "../auth";

export default function useCsapatDetails(id: number): [Csapat | undefined, boolean] {
    const user = useAuthUser();
    const [csapat, setCsapat] = useState<Csapat>();
    const [loading, setLoading] = useState(true);

    const doFetch = useCallback(() => {
        if (!!user && id !== -1) {
            getCsapat(id).then(setCsapat).catch(reason => {
                console.error(reason);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [id, user]);

    useApiPolling(doFetch);

    return [csapat, loading];
}
