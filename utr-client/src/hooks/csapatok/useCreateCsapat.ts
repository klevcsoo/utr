import {useCallback} from "react";
import {createCsapat} from "../../api/csapatok";
import {useAuthUser} from "../auth/useAuthUser";
import {Csapat} from "../../types/Csapat";

export function useCreateCsapat(): (data: Omit<Csapat, "id">) => Promise<string> {
    const user = useAuthUser();

    return useCallback((data) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                createCsapat(user, data).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [user]);
}
