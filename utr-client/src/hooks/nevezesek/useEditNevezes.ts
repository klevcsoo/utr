import {useAuthUser} from "../auth/useAuthUser";
import {useCallback} from "react";
import {NevezesCreationData} from "../../types/request/NevezesCreationData";
import {editNevezes} from "../../api/nevezesek";

export function useEditNevezes():
    (id: number, data: Partial<NevezesCreationData>) => Promise<string> {
    const user = useAuthUser();

    return useCallback((id, data) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                editNevezes(user, id, data).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [user]);
}
