import {DisplayedUser} from "../../types/DisplayedUser";
import {useEffect, useState} from "react";
import {getUser} from "../../lib/api/auth";

export function useUserDetails(userId: number): [DisplayedUser | undefined, boolean] {
    const [details, setDetails] = useState<DisplayedUser>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId !== -1) {
            getUser(userId)
                .then(setDetails)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [userId]);

    return [details, loading];
}
