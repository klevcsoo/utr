import {useCallback} from "react";
import {closeUszoverseny} from "../../api/uszoversenyek";
import {useAuthUser} from "../../auth/hooks";

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
