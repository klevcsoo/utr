import {useContext} from "react";
import {AuthContext} from "../../lib/api/auth";

export function useAuthLogin() {
    return useContext(AuthContext).login;
}
