import {Uszo} from "../../types/Uszo";
import {useAuthUser} from "../auth/useAuthUser";
import {useCallback} from "react";
import {editUszo} from "../../api/uszok";

export function useEditUszo():
    (id: number, data: Partial<Omit<Uszo, "id">>) => Promise<string> {
    const user = useAuthUser();

    return useCallback((id, data) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                editUszo(user, id, data).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [user]);
}
