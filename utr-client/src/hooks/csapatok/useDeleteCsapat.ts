import {useAuthUser} from "../auth/useAuthUser";
import {useCallback} from "react";
import {deleteCsapat} from "../../api/csapatok";
import {useTranslation} from "../translations/useTranslation";

export function useDeleteCsapat(): (id: number) => Promise<string> {
    const user = useAuthUser();
    const t = useTranslation();

    return useCallback((id) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                deleteCsapat(user, id).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject(t("error.auth.unauthenticated"));
            }
        });
    }, [t, user]);
}
