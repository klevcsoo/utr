import {useMemo} from "react";

export default function useRolesList() {
    return useMemo<string[]>(() => {
        return ["ROLE_ADMIN", "ROLE_IDOROGZITO", "ROLE_ALLITOBIRO", "ROLE_SPEAKER"];
    }, []);
}
