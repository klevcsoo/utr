import {VersenyszamCreationData} from "../types/request/VersenyszamCreationData";
import {useAuthUser} from "../auth/hooks";
import {useCallback, useEffect, useState} from "react";
import {
    createVersenyszam,
    deleteVersenyszam,
    editVersenyszam,
    getVersenyszam,
    getVersenyszamokInVerseny
} from "./api";
import {RefreshableLiveData} from "../types/RefreshableLiveData";
import {Versenyszam} from "../types/model/Versenyszam";

export function useCreateVersenyszam():
    (data: Omit<VersenyszamCreationData, "id">) => Promise<string> {
    const user = useAuthUser();

    return useCallback(data => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                createVersenyszam(user, data).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [user]);
}

export function useDeleteVersenyszam():
    (id: number) => Promise<string> {
    const user = useAuthUser();

    return useCallback((id) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                deleteVersenyszam(user, id).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [user]);
}

export function useEditVersenyszam():
    (id: number, data: Partial<Omit<VersenyszamCreationData, "id">>) => Promise<string> {
    const user = useAuthUser();

    return useCallback((id, data) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                editVersenyszam(user, id, data).then(({message}) => {
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [user]);
}

export function useVersenyszamDetails(id: number): RefreshableLiveData<Versenyszam> {
    const user = useAuthUser();
    const [uszo, setUszo] = useState<Versenyszam>();
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        if (!!user && id !== -1) {
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
