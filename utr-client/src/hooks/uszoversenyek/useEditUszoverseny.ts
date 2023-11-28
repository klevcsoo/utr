import {useCallback} from "react";
import {editUszoverseny} from "../../api/uszoversenyek";
import {Uszoverseny} from "../../types/model/Uszoverseny";
import {useAuthUser} from "../../auth/hooks";

export function useEditUszoverseny():
    (id: number, data: Partial<Omit<Uszoverseny, "id">>) => Promise<string> {
    const user = useAuthUser();

    return useCallback((id, data) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                editUszoverseny(user, id, data).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [user]);
}
