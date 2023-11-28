import {useCallback} from "react";
import {Uszoverseny} from "../../types/model/Uszoverseny";
import {createUszoverseny} from "../../api/uszoversenyek";
import {useAuthUser} from "../../auth/hooks";

export function useCreateUszoverseny():
    (data: Omit<Uszoverseny, "id">) => Promise<string> {
    const user = useAuthUser();

    return useCallback(data => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                createUszoverseny(user, data).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [user]);
}
