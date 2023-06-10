import {useEffect, useState} from "react";
import {useAuthUser} from "../auth/useAuthUser";
import {Uszoverseny} from "../../types/Uszoverseny";
import {getUszoverseny} from "../../api/versenyek";

export function useUszoversenyDetails(id: number): [Uszoverseny | undefined, boolean] {
    const user = useAuthUser();
    const [uszoverseny, setUszoverseny] = useState<Uszoverseny>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!!user && id !== -1) {
            getUszoverseny(user, id).then(setUszoverseny).catch(console.error).finally(() => {
                setLoading(false);
            });
        }
    }, [id, user]);

    return [uszoverseny, loading];
}
