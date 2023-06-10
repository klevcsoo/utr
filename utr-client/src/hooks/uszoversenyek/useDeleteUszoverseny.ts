import {useAuthUser} from "../auth/useAuthUser";
import {useCallback} from "react";
import {deleteUszoverseny} from "../../api/versenyek";

export function useDeleteUszoverseny():
    (id: number) => Promise<string> {
    const user = useAuthUser();

    return useCallback((id) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                deleteUszoverseny(user, id).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [user]);
}
