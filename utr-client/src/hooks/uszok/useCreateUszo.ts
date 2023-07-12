import {Uszo} from "../../types/model/Uszo";
import {useAuthUser} from "../auth/useAuthUser";
import {useCallback} from "react";
import {createUszo} from "../../api/uszok";
import {useTranslation} from "../translations/useTranslation";

export function useCreateUszo():
    (data: Omit<Uszo, "id">) => Promise<string> {
    const user = useAuthUser();
    const t = useTranslation();

    return useCallback(data => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                createUszo(user, data).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject(t("error.auth.unauthenticated"));
            }
        });
    }, [t, user]);
}
