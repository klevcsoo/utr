import {useEffect, useState} from "react";
import {useAuthUser} from "../auth/useAuthUser";
import {Versenyszam} from "../../types/Versenyszam";
import {getVersenyszam} from "../../api/versenyszamok";

export function useVersenyszamDetails(id: number): [Versenyszam | undefined, boolean] {
    const user = useAuthUser();
    const [uszo, setUszo] = useState<Versenyszam>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!!user && id !== -1) {
            getVersenyszam(user, id).then(setUszo).catch(console.error).finally(() => {
                setLoading(false);
            });
        }
    }, [id, user]);

    return [uszo, loading];
}
