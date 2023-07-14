import {DisplayedUser} from "../../types/DisplayedUser";
import {useEffect, useState} from "react";
import {getAllUsers} from "../../api/auth";
import {useAuthUser} from "./useAuthUser";

export function useUsersList(): DisplayedUser[] {
    const user = useAuthUser()!;
    const [list, setList] = useState<DisplayedUser[]>([]);

    useEffect(() => {
        getAllUsers(user).then(setList).catch(console.error);
    }, [user]);

    return list;
}
