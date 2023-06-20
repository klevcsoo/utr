import {useAuthUser} from "../auth/useAuthUser";
import {useCallback} from "react";
import {NevezesCreationData} from "../../types/request/NevezesCreationData";
import {createNevezes} from "../../api/nevezesek";

export function useCreateNevezes():
    (data: NevezesCreationData) => Promise<string> {
    const user = useAuthUser();

    return useCallback(data => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                createNevezes(user, data).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [user]);
}
