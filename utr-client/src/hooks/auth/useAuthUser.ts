import {useContext} from "react";
import {AuthContext} from "../../lib/api/auth";

export function useAuthUser() {
    return useContext(AuthContext).user;
}
