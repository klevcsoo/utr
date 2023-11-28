import {useContext} from "react";
import {AuthContext} from "../../lib/api/auth";

export default function useAuthLogout() {
    return useContext(AuthContext).logout;
}
