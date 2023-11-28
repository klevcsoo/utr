import {Uszo} from "../../types/model/Uszo";
import {useCallback} from "react";
import {editUszo} from "../../api/uszok";
import {useTranslation} from "../translations/useTranslation";
import {useAuthUser} from "../../auth/hooks";

export function useEditUszo():
    (id: number, data: Partial<Omit<Uszo, "id">>) => Promise<string> {
    const user = useAuthUser();
    const t = useTranslation();

    return useCallback((id, data) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                editUszo(user, id, data).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject(t("error.auth.unauthenticated"));
            }
        });
    }, [t, user]);
}
