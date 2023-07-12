import {Csapat} from "../../types/model/Csapat";
import {useAuthUser} from "../auth/useAuthUser";
import {useCallback} from "react";
import {editCsapat} from "../../api/csapatok";
import {useTranslation} from "../translations/useTranslation";

export function useEditCsapat():
    (id: number, data: Partial<Omit<Csapat, "id">>) => Promise<string> {
    const user = useAuthUser();
    const t = useTranslation();

    return useCallback((id, data) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                editCsapat(user, id, data).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject(t("error.auth.unauthenticated"));
            }
        });
    }, [t, user]);
}
