import {useAuthUser} from "../auth/hooks";
import {useCallback, useContext, useEffect, useState} from "react";
import {
    createVersenyszam,
    deleteVersenyszam,
    editVersenyszam,
    getVersenyszam,
    getVersenyszamokInVerseny
} from "./api";
import {RefreshableLiveData} from "../utils/types";
import {Versenyszam, VersenyszamCreationData} from "./types";
import {VersenyszamContext} from "./index";
import {useUszoversenyFromContext} from "../uszoversenyek/hooks";

export function useCreateVersenyszam():
    (data: Omit<VersenyszamCreationData, "id">) => Promise<string> {
    const user = useAuthUser();
    const {refresh} = useUszoversenyFromContext();

    return useCallback(data => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                createVersenyszam(user, data).then(({message}) => {
                    refresh("versenyszamok");
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [refresh, user]);
}

export function useDeleteVersenyszam():
    (id: number) => Promise<string> {
    const user = useAuthUser();
    const {refresh} = useUszoversenyFromContext();

    return useCallback((id) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                deleteVersenyszam(user, id).then(({message}) => {
                    refresh("versenyszamok");
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [refresh, user]);
}

export function useEditVersenyszam():
    (id: number, data: Partial<Omit<VersenyszamCreationData, "id">>) => Promise<string> {
    const user = useAuthUser();
    const {refresh} = useUszoversenyFromContext();

    return useCallback((id, data) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                editVersenyszam(user, id, data).then(({message}) => {
                    refresh("versenyszamok");
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [refresh, user]);
}

export function useVersenyszamDetails(id?: number): RefreshableLiveData<Versenyszam> {
    const user = useAuthUser();
    const [uszo, setUszo] = useState<Versenyszam>();
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        if (!!user && !!id) {
            getVersenyszam(user, id).then(setUszo).catch(console.error).finally(() => {
                setLoading(false);
            });
        }
    }, [id, user]);

    useEffect(refresh, [refresh]);

    return [uszo, loading, refresh];
}

export function useVersenyszamokList(
    uszoversenyId: number | undefined
): RefreshableLiveData<Versenyszam[]> {
    const user = useAuthUser();
    const [list, setList] = useState<Versenyszam[]>([]);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(() => {
        if (!!uszoversenyId && !!user) {
            getVersenyszamokInVerseny(user, uszoversenyId).then(setList).catch(reason => {
                console.error(reason);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [user, uszoversenyId]);

    useEffect(refresh, [refresh]);

    return [list, loading, refresh];
}

export function useVersenyszamFromContext() {
    return useContext(VersenyszamContext);
}
