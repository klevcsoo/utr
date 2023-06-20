import {useEffect, useState} from "react";
import {useAuthUser} from "../auth/useAuthUser";
import {Nevezes} from "../../types/model/Nevezes";
import {getNevezes} from "../../api/nevezesek";

export function useNevezesDetails(id: number): [Nevezes | undefined, boolean] {
    const user = useAuthUser();
    const [nevezes, setNevezes] = useState<Nevezes>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!!user && id !== -1) {
            getNevezes(user, id).then(setNevezes).catch(console.error).finally(() => {
                setLoading(false);
            });
        }
    }, [id, user]);

    return [nevezes, loading];
}
