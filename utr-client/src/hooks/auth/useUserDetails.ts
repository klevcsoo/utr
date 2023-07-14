import {DisplayedUser} from "../../types/DisplayedUser";
import {useEffect, useState} from "react";
import {useAuthUser} from "./useAuthUser";
import {getUser} from "../../api/auth";

export function useUserDetails(userId: number): [DisplayedUser | undefined, boolean] {
    const user = useAuthUser()!;
    const [details, setDetails] = useState<DisplayedUser>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId !== -1) {
            getUser(user, userId)
                .then(setDetails)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [user, userId]);

    return [details, loading];
}
