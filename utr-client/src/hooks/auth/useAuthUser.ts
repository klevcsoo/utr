import {useContext} from "react";
import {AuthContext} from "../../lib/api/auth";

export default function useAuthUser() {
    return useContext(AuthContext).user;
}
