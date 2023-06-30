import {useEffect, useState} from "react";
import {useAuthUser} from "../auth/useAuthUser";
import {getApiServerEnvVars} from "../../api/support";
import {Identifiable} from "../../types/Identifiable";
import {KeyValueObject} from "../../types/KeyValueObject";

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
