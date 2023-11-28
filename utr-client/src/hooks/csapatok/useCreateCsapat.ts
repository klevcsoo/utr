import {useCallback} from "react";
import {createCsapat} from "../../api/csapatok";
import {Csapat} from "../../types/model/Csapat";
import {useTranslation} from "../translations/useTranslation";
import {useAuthUser} from "../../auth/hooks";

export function useCreateCsapat(): (data: Omit<Csapat, "id">) => Promise<string> {
    const user = useAuthUser();
    const t = useTranslation();

    return useCallback((data) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                createCsapat(user, data).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject(t("error.auth.unauthenticated"));
            }
        });
    }, [t, user]);
}
