import {Csapat} from "../../types/Csapat";
import {useAuthUser} from "../auth/useAuthUser";
import {useCallback} from "react";
import {editCsapat} from "../../api/csapatok";

export function useEditCsapat():
    (id: number, data: Partial<Omit<Csapat, "id">>) => Promise<string> {
    const user = useAuthUser();

    return useCallback((id, data) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                editCsapat(user, id, data).then(({message}) => resolve(message));
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [user]);
}
