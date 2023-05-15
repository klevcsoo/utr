import {Uszo} from "../types/Uszo";
import {useEffect, useState} from "react";
import {useAuthUser} from "./useAuthUser";
import {getAllUszokInCsapat} from "../api/uszok";

export function useUszokList(csapatId: number | undefined): [Uszo[], boolean] {
    const {user} = useAuthUser();
    const [list, setList] = useState<Uszo[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!!csapatId && !!user) {
            getAllUszokInCsapat(user, csapatId).then(setList).catch(reason => {
                console.error(reason);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [user, csapatId]);

    return [list, loading];
}
