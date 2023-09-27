import {useContext} from "react";
import {AuthContext} from "../../lib/api/auth";

export function useAuthLogout() {
    return useContext(AuthContext).logout;
}
