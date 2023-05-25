import {useContext} from "react";
import {AuthContext} from "../../api/auth";

export function useAuthLogin() {
    return useContext(AuthContext).login;
}
