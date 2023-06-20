import {useAuthUser} from "../auth/useAuthUser";
import {useCallback} from "react";
import {deleteNevezes} from "../../api/nevezesek";

export function useDeleteNevezes():
    (id: number) => Promise<string> {
    const user = useAuthUser();

    return useCallback((id) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                deleteNevezes(user, id).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [user]);
}
