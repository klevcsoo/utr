import {Uszo} from "../../types/Uszo";
import {useAuthUser} from "../auth/useAuthUser";
import {useCallback} from "react";
import {createUszo} from "../../api/uszok";

export function useCreateUszo():
    (data: Omit<Uszo, "id">) => Promise<string> {
    const user = useAuthUser();

    return useCallback(data => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                createUszo(user, data).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [user]);
}
