import {useCallback} from "react";
import {NevezesCreationData} from "../../types/request/NevezesCreationData";
import {createNevezes} from "../../api/nevezesek";
import {useTranslation} from "../translations/useTranslation";
import {useAuthUser} from "../../auth/hooks";

export function useCreateNevezes():
    (data: NevezesCreationData) => Promise<string> {
    const user = useAuthUser();
    const t = useTranslation();

    return useCallback(data => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                createNevezes(user, data).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject(t("error.auth.unauthenticated"));
            }
        });
    }, [t, user]);
}
