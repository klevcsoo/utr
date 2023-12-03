import {useAuthUser} from "../auth/hooks";
import {useCallback, useContext, useEffect, useState} from "react";
import {createCsapat, deleteCsapat, editCsapat, getAllCsapatokList, getCsapat} from "./api";
import {useTranslation} from "../translations/hooks";
import {RefreshableLiveData} from "../utils/types";
import {Csapat} from "./types";
import {CsapatContext} from "./index";
import {useOrganisationFromContext} from "../organisation/hooks";

export function useCreateCsapat(): (data: Omit<Csapat, "id">) => Promise<string> {
    const user = useAuthUser();
    const t = useTranslation();
    const {refresh} = useOrganisationFromContext();

    return useCallback((data) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                createCsapat(user, data).then(({message}) => {
                    refresh("csapatok");
                    resolve(message);
                }).catch(reject);
            } else {
                reject(t("error.auth.unauthenticated"));
            }
        });
    }, [refresh, t, user]);
}

export function useCsapatDetails(id?: number): RefreshableLiveData<Csapat> {
    const user = useAuthUser();
    const [csapat, setCsapat] = useState<Csapat>();
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        if (!!user && !!id) {
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
    const {refresh} = useOrganisationFromContext();

    return useCallback((id) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                deleteCsapat(user, id).then(({message}) => {
                    refresh("csapatok");
                    resolve(message);
                }).catch(reject);
            } else {
                reject(t("error.auth.unauthenticated"));
            }
        });
    }, [refresh, t, user]);
}

export function useEditCsapat():
    (id: number, data: Partial<Omit<Csapat, "id">>) => Promise<string> {
    const user = useAuthUser();
    const t = useTranslation();
    const {refresh} = useCsapatFromContext();

    return useCallback((id, data) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                editCsapat(user, id, data).then(({message}) => {
                    refresh("csapat");
                    resolve(message);
                }).catch(reject);
            } else {
                reject(t("error.auth.unauthenticated"));
            }
        });
    }, [refresh, t, user]);
}

export function useCsapatFromContext() {
    return useContext(CsapatContext);
}
