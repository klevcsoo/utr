import {useAuthUser} from "../auth/useAuthUser";
import {useCallback} from "react";
import {deleteUszo} from "../../api/uszok";

export function useDeleteUszo():
    (id: number) => Promise<string> {
    const user = useAuthUser();

    return useCallback((id) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                deleteUszo(user, id).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [user]);
}
