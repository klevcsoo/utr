import {useAuthUser} from "../auth/hooks";
import {useCallback, useContext, useEffect, useState} from "react";
import {
    closeUszoverseny,
    createUszoverseny,
    deleteUszoverseny,
    editUszoverseny,
    getAllUszoversenyekList,
    getOpenUszoverseny,
    getOpenVersenyszamok,
    getUszoverseny,
    openUszoverseny
} from "./api";
import {RefreshableLiveData} from "../utils/types";
import {Uszoverseny} from "./types";
import {Versenyszam} from "../versenyszamok/types";
import {UszoversenyContext} from "./index";
import {useOrganisationFromContext} from "../organisation/hooks";

export function useNyitottVerseny():
    RefreshableLiveData<(Uszoverseny & { versenyszamok: Versenyszam[] })> {
    const user = useAuthUser();

    const [uszoverseny, setUszoverseny] = useState<Uszoverseny>();
    const [versenyszamok, setVersenyszamok] = useState<Versenyszam[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        if (!!user) {
            getOpenUszoverseny(user).then(setUszoverseny).catch(reason => {
                console.error(reason);
            }).finally(() => setLoading(false));
            getOpenVersenyszamok(user).then(setVersenyszamok).catch(reason => {
                console.error(reason);
            }).finally(() => setLoading(false));
        }
    }, [user]);

    useEffect(refresh, [refresh]);

    return [
        !uszoverseny ? undefined : {...uszoverseny, versenyszamok: versenyszamok},
        loading,
        refresh
    ];
}

export function useCloseUszoverseny(): () => Promise<string> {
    const user = useAuthUser();
    const {refresh} = useOrganisationFromContext();

    return useCallback(() => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                closeUszoverseny(user).then(({message}) => {
                    refresh("uszoversenyek");
                    refresh("nyitottUszoverseny");
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [refresh, user]);
}

export function useCreateUszoverseny():
    (data: Omit<Uszoverseny, "id">) => Promise<string> {
    const user = useAuthUser();
    const {refresh} = useOrganisationFromContext();

    return useCallback(data => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                createUszoverseny(user, data).then(({message}) => {
                    refresh("uszoversenyek");
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [refresh, user]);
}

export function useDeleteUszoverseny():
    (id: number) => Promise<string> {
    const user = useAuthUser();
    const {refresh} = useOrganisationFromContext();

    return useCallback((id) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                deleteUszoverseny(user, id).then(({message}) => {
                    refresh("uszoversenyek");
                    refresh("nyitottUszoverseny");
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [refresh, user]);
}

export function useEditUszoverseny():
    (id: number, data: Partial<Omit<Uszoverseny, "id">>) => Promise<string> {
    const user = useAuthUser();
    const {refresh} = useOrganisationFromContext();

    return useCallback((id, data) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                editUszoverseny(user, id, data).then(({message}) => {
                    refresh("uszoversenyek");
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [refresh, user]);
}

export function useOpenUszoverseny(): (id: number) => Promise<string> {
    const user = useAuthUser();
    const {refresh} = useOrganisationFromContext();

    return useCallback((id) => {
        return new Promise((resolve, reject) => {
            if (!!user) {
                openUszoverseny(user, id).then(({message}) => {
                    refresh("uszoversenyek");
                    refresh("nyitottUszoverseny");
                    resolve(message);
                }).catch(reject);
            } else {
                reject("Úgy látszik nem vagy bejelentkezve.");
            }
        });
    }, [refresh, user]);
}

export function useUszoversenyDetails(id?: number): RefreshableLiveData<Uszoverseny> {
    const user = useAuthUser();
    const [uszoverseny, setUszoverseny] = useState<Uszoverseny>();
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        if (!!user && !!id) {
            getUszoverseny(user, id).then(setUszoverseny).catch(console.error).finally(() => {
                setLoading(false);
            });
        }
    }, [id, user]);

    useEffect(refresh, [refresh]);

    return [uszoverseny, loading, refresh];
}

export function useUszoversenyekList(): RefreshableLiveData<Uszoverseny[]> {
    const user = useAuthUser();
    const [list, setList] = useState<Uszoverseny[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        if (!!user) {
            getAllUszoversenyekList(user).then(response => {
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

export function useUszoversenyFromContext() {
    return useContext(UszoversenyContext);
}
