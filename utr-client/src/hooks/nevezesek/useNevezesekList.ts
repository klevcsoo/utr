import {useEffect, useState} from "react";
import {useAuthUser} from "../auth/useAuthUser";
import {Nevezes} from "../../types/model/Nevezes";
import {getAllNevezesek} from "../../api/nevezesek";

export function useNevezesekList(versenyszamId: number | undefined): [Nevezes[], boolean] {
    const user = useAuthUser();
    const [list, setList] = useState<Nevezes[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!!versenyszamId && !!user) {
            getAllNevezesek(user, versenyszamId).then(setList).catch(reason => {
                console.error(reason);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [user, versenyszamId]);

    return [list, loading];
}
