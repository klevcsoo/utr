import {useCallback} from "react";
import {createVersenyszam} from "../../api/versenyszamok";
import {VersenyszamCreationData} from "../../types/request/VersenyszamCreationData";
import {useAuthUser} from "../../auth/hooks";

export function useCreateVersenyszam():
    (data: Omit<VersenyszamCreationData, "id">) => Promise<string> {
    const user = useAuthUser();

    return useCallback(data => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                createVersenyszam(user, data).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [user]);
}
