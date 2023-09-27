import {useContext} from "react";
import {AuthContext} from "../../lib/api/auth";

export default function useAuthLogin() {
    return useContext(AuthContext).login;
}
