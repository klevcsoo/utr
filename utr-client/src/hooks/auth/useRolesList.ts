import {useMemo} from "react";

export function useRolesList() {
    return useMemo<string[]>(() => {
        return ["ROLE_ADMIN", "ROLE_IDOROGZITO", "ROLE_ALLITOBIRO", "ROLE_SPEAKER"];
    }, []);
}
