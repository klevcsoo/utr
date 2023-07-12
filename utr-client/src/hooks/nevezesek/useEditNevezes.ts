import {useAuthUser} from "../auth/useAuthUser";
import {useCallback} from "react";
import {NevezesCreationData} from "../../types/request/NevezesCreationData";
import {editNevezes} from "../../api/nevezesek";
import {useTranslation} from "../translations/useTranslation";

export function useEditNevezes():
    (id: number, data: Partial<NevezesCreationData>) => Promise<string> {
    const user = useAuthUser();
    const t = useTranslation();

    return useCallback((id, data) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                editNevezes(user, id, data).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject(t("error.auth.unauthenticated"));
            }
        });
    }, [t, user]);
}
