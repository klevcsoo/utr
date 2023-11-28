import {Csapat} from "../types/model/Csapat";
import {useAuthUser} from "../auth/hooks";
import {useCallback, useEffect, useState} from "react";
import {createCsapat, deleteCsapat, editCsapat, getAllCsapatokList, getCsapat} from "./api";
import {RefreshableLiveData} from "../types/RefreshableLiveData";
import {useTranslation} from "../translations/hooks";

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

export function useCsapatDetails(id: number): RefreshableLiveData<Csapat> {
    const user = useAuthUser();
    const [csapat, setCsapat] = useState<Csapat>();
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        if (!!user && id !== -1) {
            getCsapat(user, id).then(setCsapat).catch(reason => {
                console.error(reason);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [id, user]);

    useEffect(refresh, [refresh]);

    return [csapat, loading, refresh];
}

export function useCsapatokList(): RefreshableLiveData<Csapat[]> {
    const user = useAuthUser();
    const [list, setList] = useState<Csapat[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        if (!!user) {
            getAllCsapatokList(user).then(response => {
                setList(response);
            }).catch(reason => {
                console.error(reason);
            }).finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(true);
        }
    }, [user]);

    useEffect(refresh, [refresh]);

    return [list, loading, refresh];
}

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
