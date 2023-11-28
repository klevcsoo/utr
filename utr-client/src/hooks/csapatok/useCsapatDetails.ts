import {Csapat} from "../../types/model/Csapat";
import {useCallback, useEffect, useState} from "react";
import {getCsapat} from "../../api/csapatok";
import {RefreshableLiveData} from "../../types/RefreshableLiveData";
import {useAuthUser} from "../../auth/hooks";

export function useCsapatDetails(id: number): RefreshableLiveData<Csapat> {
    const user = useAuthUser();
    const [csapat, setCsapat] = useState<Csapat>();
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        if (!!user && id !== -1) {
            getCsapat(user, id).then(setCsapat).catch(reason => {
                console.error(reason);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [id, user]);

    useEffect(refresh, [refresh]);

    return [csapat, loading, refresh];
}
