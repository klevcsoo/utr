import {Csapat} from "../types/Csapat";
import {useCallback, useEffect, useState} from "react";
import {useAuthUser} from "./useAuthUser";
import {deleteCsapat, editCsapat, getCsapat} from "../api/csapatok";

export function useCsapatDetails(id: number | undefined): [{
    details: Csapat
    edit: (data: Partial<Omit<Csapat, "id">>) => void
    delete: () => void
} | undefined, boolean] {
    const {user} = useAuthUser();
    const [csapat, setCsapat] = useState<Csapat>();
    const [loading, setLoading] = useState(true);

    const doEdit = useCallback<(data: Partial<Omit<Csapat, "id">>) => void>((data) => {
        if (!!csapat && !!user) {
            editCsapat(user, data).then(({message}) => {
                console.log(message);
            });
        }
    }, [csapat, user]);

    const doDelete = useCallback<() => void>(() => {
        if (!!csapat && !!user) {
            deleteCsapat(user, csapat.id).then(({message}) => {
                console.log(message);
            });
        }
    }, [csapat, user]);

    useEffect(() => {
        if (!!user && !!id) {
            getCsapat(user, id).then(setCsapat).catch(reason => {
                console.error(reason);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [id, user]);

    return [!csapat ? undefined : {
        details: csapat, delete: doDelete, edit: doEdit
    }, loading];
}
