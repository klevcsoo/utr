import {useContext} from "react";
import {AuthContext} from "../../api/auth";

export function useAuthLogout() {
    return useContext(AuthContext).logout;
}
