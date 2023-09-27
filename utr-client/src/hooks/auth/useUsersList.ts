import {DisplayedUser} from "../../types/DisplayedUser";
import {useEffect, useState} from "react";
import {getAllUsers} from "../../lib/api/auth";

export function useUsersList(): DisplayedUser[] {
    const [list, setList] = useState<DisplayedUser[]>([]);

    useEffect(() => {
        getAllUsers().then(setList).catch(console.error);
    }, []);

    return list;
}
