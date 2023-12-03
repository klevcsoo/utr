import {useAuthUser} from "../auth/hooks";
import {useTranslation} from "../translations/hooks";
import {useCallback, useEffect, useState} from "react";
import {createUszo, deleteUszo, editUszo, getAllUszokInCsapat, getUszo} from "./api";

import {RefreshableLiveData} from "../utils/types";
import {Uszo} from "./types";
import {useCsapatFromContext} from "../csapatok/hooks";

export function useCreateUszo():
    (data: Omit<Uszo, "id">) => Promise<string> {
    const user = useAuthUser();
    const t = useTranslation();
    const {refresh} = useCsapatFromContext();

    return useCallback(data => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                createUszo(user, data).then(({message}) => {
                    refresh("uszok");
                    resolve(message);
                }).catch(reject);
            } else {
                reject(t("error.auth.unauthenticated"));
            }
        });
    }, [refresh, t, user]);
}

export function useDeleteUszo():
    (id: number) => Promise<string> {
    const user = useAuthUser();
    const t = useTranslation();
    const {refresh} = useCsapatFromContext();

    return useCallback((id) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                deleteUszo(user, id).then(({message}) => {
                    refresh("uszok");
                    resolve(message);
                }).catch(reject);
            } else {
                reject(t("error.auth.unauthenticated"));
            }
        });
    }, [refresh, t, user]);
}

export function useEditUszo():
    (id: number, data: Partial<Omit<Uszo, "id">>) => Promise<string> {
    const user = useAuthUser();
    const t = useTranslation();
    const {refresh} = useCsapatFromContext();

    return useCallback((id, data) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                editUszo(user, id, data).then(({message}) => {
                    refresh("uszok");
                    resolve(message);
                }).catch(reject);
            } else {
                reject(t("error.auth.unauthenticated"));
            }
        });
    }, [refresh, t, user]);
}

export function useUszoDetails(id?: number): RefreshableLiveData<Uszo> {
    const user = useAuthUser();
    const [uszo, setUszo] = useState<Uszo>();
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        if (!!user && !!id) {
            getUszo(user, id).then(setUszo).catch(console.error).finally(() => {
                setLoading(false);
            });
        }
    }, [id, user]);

    useEffect(refresh, [refresh]);

    return [uszo, loading, refresh];
}

export function useUszokList(csapatId: number | undefined): RefreshableLiveData<Uszo[]> {
    const user = useAuthUser();
    const [list, setList] = useState<Uszo[]>([]);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(() => {
        if (!!csapatId && !!user) {
            getAllUszokInCsapat(user, csapatId).then(setList).catch(reason => {
                console.error(reason);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [user, csapatId]);

    useEffect(refresh, [refresh]);

    return [list, loading, refresh];
}
