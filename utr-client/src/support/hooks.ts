import {useAuthUser} from "../auth/hooks";
import {useCallback, useEffect, useState} from "react";
import {getApiServerEnvVars, getApiServerLog} from "./api";
import {Identifiable, KeyValueObject} from "../utils/types";

export function useServerEnvVars(): [Identifiable<KeyValueObject<string>>[], boolean] {
    const user = useAuthUser();
    const [variableMap, setVariableMap] = useState<Identifiable<KeyValueObject<string>>[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!!user) {
            getApiServerEnvVars(user)
                .then(map => {
                    setVariableMap(Object.keys(map).map((key, index) => {
                        return {
                            id: index,
                            key: key,
                            value: map[key]
                        } as Identifiable<KeyValueObject<string>>;
                    }));
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [user]);

    return [variableMap, loading];
}

export function useServerLog(): [string[], boolean, () => void] {
    const user = useAuthUser();
    const [lines, setLines] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const doLoad = useCallback(() => {
        if (!!user) {
            setLoading(true);
            getApiServerLog(user).then(setLines).catch(console.error).finally(() => {
                setLoading(false);
            });
        }
    }, [user]);

    useEffect(doLoad, [doLoad]);

    return [lines, loading, doLoad];
}
