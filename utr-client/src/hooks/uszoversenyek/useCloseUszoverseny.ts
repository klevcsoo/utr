import {useAuthUser} from "../auth/useAuthUser";
import {useCallback} from "react";
import {closeUszoverseny} from "../../api/uszoversenyek";

export function useCloseUszoverseny(): () => Promise<string> {
    const user = useAuthUser();

    return useCallback(() => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                closeUszoverseny(user).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [user]);
}
