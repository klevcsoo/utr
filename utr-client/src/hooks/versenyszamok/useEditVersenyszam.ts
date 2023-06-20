import {useAuthUser} from "../auth/useAuthUser";
import {useCallback} from "react";
import {editVersenyszam} from "../../api/versenyszamok";
import {VersenyszamCreationData} from "../../types/request/VersenyszamCreationData";

export function useEditVersenyszam():
    (id: number, data: Partial<Omit<VersenyszamCreationData, "id">>) => Promise<string> {
    const user = useAuthUser();

    return useCallback((id, data) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                editVersenyszam(user, id, data).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [user]);
}
