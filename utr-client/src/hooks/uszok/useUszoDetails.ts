import {useEffect, useState} from "react";
import {Uszo} from "../../types/model/Uszo";
import {useAuthUser} from "../auth/useAuthUser";
import {getUszo} from "../../api/uszok";

export function useUszoDetails(id: number): [Uszo | undefined, boolean] {
    const user = useAuthUser();
    const [uszo, setUszo] = useState<Uszo>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!!user && id !== -1) {
            getUszo(user, id).then(setUszo).catch(console.error).finally(() => {
                setLoading(false);
            });
        }
    }, [id, user]);

    return [uszo, loading];
}
