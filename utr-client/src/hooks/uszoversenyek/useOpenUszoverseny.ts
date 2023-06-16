import {useAuthUser} from "../auth/useAuthUser";
import {useCallback} from "react";
import {openUszoverseny} from "../../api/versenyek";

export function useOpenUszoverseny(): (id: number) => Promise<string> {
    const user = useAuthUser();

    return useCallback((id) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                openUszoverseny(user, id).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [user]);
}
