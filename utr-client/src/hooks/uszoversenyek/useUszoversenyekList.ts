import {useEffect, useState} from "react";
import {useAuthUser} from "../auth/useAuthUser";
import {Uszoverseny} from "../../types/Uszoverseny";
import {getAllUszoversenyekList} from "../../api/versenyek";

export function useUszoversenyekList(): [Uszoverseny[], boolean] {
    const user = useAuthUser();
    const [list, setList] = useState<Uszoverseny[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!!user) {
            getAllUszoversenyekList(user).then(response => {
                setList(response);
                console.log(response);
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
