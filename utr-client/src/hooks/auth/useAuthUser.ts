import {useContext} from "react";
import {AuthContext} from "../../api/auth";

export function useAuthUser() {
    return useContext(AuthContext).user;
}
