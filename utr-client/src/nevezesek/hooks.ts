import {useAuthUser} from "../auth/hooks";
import {useCallback, useEffect, useState} from "react";
import {createNevezes, deleteNevezes, editNevezes, getAllNevezesek, getNevezes} from "./api";
import {useTranslation} from "../translations/hooks";
import {RefreshableLiveData} from "../utils/types";
import {Nevezes, NevezesCreationData} from "./types";
import {useVersenyszamFromContext} from "../versenyszamok/hooks";

export function useCreateNevezes():
    (data: NevezesCreationData) => Promise<string> {
    const user = useAuthUser();
    const t = useTranslation();
    const {refresh} = useVersenyszamFromContext();

    return useCallback(data => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                createNevezes(user, data).then(({message}) => {
                    refresh("nevezesek");
                    resolve(message);
                }).catch(reject);
            } else {
                reject(t("error.auth.unauthenticated"));
            }
        });
    }, [refresh, t, user]);
}

export function useDeleteNevezes():
    (id: number) => Promise<string> {
    const user = useAuthUser();
    const t = useTranslation();
    const {refresh} = useVersenyszamFromContext();

    return useCallback((id) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                deleteNevezes(user, id).then(({message}) => {
                    refresh("nevezesek");
                    resolve(message);
                }).catch(reject);
            } else {
                reject(t("error.auth.unauthenticated"));
            }
        });
    }, [refresh, t, user]);
}

export function useEditNevezes():
    (id: number, data: Partial<NevezesCreationData>) => Promise<string> {
    const user = useAuthUser();
    const t = useTranslation();
    const {refresh} = useVersenyszamFromContext();

    return useCallback((id, data) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                editNevezes(user, id, data).then(({message}) => {
                    refresh("nevezesek");
                    resolve(message);
                }).catch(reject);
            } else {
                reject(t("error.auth.unauthenticated"));
            }
        });
    }, [refresh, t, user]);
}

export function useNevezesDetails(id?: number): RefreshableLiveData<Nevezes> {
    const user = useAuthUser();
    const [nevezes, setNevezes] = useState<Nevezes>();
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        if (!!user && !!id) {
            getNevezes(user, id).then(setNevezes).catch(console.error).finally(() => {
                setLoading(false);
            });
        }
    }, [id, user]);

    useEffect(refresh, [refresh]);

    return [nevezes, loading, refresh];
}

export function useNevezesekList(
    versenyszamId: number | undefined
): RefreshableLiveData<Nevezes[]> {
    const user = useAuthUser();
    const [list, setList] = useState<Nevezes[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        if (!!versenyszamId && !!user) {
            getAllNevezesek(user, versenyszamId).then(setList).catch(reason => {
                console.error(reason);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [user, versenyszamId]);

    useEffect(refresh, [refresh]);

    return [list, loading, refresh];
}