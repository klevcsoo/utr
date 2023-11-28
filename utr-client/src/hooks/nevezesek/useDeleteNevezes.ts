import {useCallback} from "react";
import {deleteNevezes} from "../../api/nevezesek";
import {useTranslation} from "../translations/useTranslation";
import {useAuthUser} from "../../auth/hooks";

export function useDeleteNevezes():
    (id: number) => Promise<string> {
    const user = useAuthUser();
    const t = useTranslation();

    return useCallback((id) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                deleteNevezes(user, id).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject(t("error.auth.unauthenticated"));
            }
        });
    }, [t, user]);
}
