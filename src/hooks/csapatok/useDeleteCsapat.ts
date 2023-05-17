import {useAuthUser} from "../auth/useAuthUser";
import {useCallback} from "react";
import {deleteCsapat} from "../../api/csapatok";

export function useDeleteCsapat(): (id: number) => Promise<string> {
    const user = useAuthUser();

    return useCallback((id) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                deleteCsapat(user, id).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [user]);
}
