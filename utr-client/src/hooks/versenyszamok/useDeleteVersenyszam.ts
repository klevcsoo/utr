import {useCallback} from "react";
import {deleteVersenyszam} from "../../api/versenyszamok";
import {useAuthUser} from "../../auth/hooks";

export function useDeleteVersenyszam():
    (id: number) => Promise<string> {
    const user = useAuthUser();

    return useCallback((id) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                deleteVersenyszam(user, id).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [user]);
}
