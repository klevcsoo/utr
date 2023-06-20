import {useEffect, useState} from "react";
import {Csapat} from "../../types/model/Csapat";
import {getAllCsapatokList} from "../../api/csapatok";
import {useAuthUser} from "../auth/useAuthUser";

export function useCsapatokList(): [Csapat[], boolean] {
    const user = useAuthUser();
    const [list, setList] = useState<Csapat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!!user) {
            getAllCsapatokList(user).then(response => {
                setList(response);
            }).catch(reason => {
                console.error(reason);
            }).finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(true);
        }
    }, [user]);

    return [list, loading];
}
