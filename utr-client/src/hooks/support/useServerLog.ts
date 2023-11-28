import {useCallback, useEffect, useState} from "react";
import {getApiServerLog} from "../../api/support";

import {useAuthUser} from "../../auth/hooks";

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
