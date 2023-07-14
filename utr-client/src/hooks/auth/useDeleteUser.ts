import {useCallback} from "react";
import {deleteUser} from "../../api/auth";
import {useAuthUser} from "./useAuthUser";
import {MessageResponse} from "../../types/response/MessageResponse";

export function useDeleteUser() {
    const user = useAuthUser()!;

    return useCallback((userId: number) => {
        return new Promise<MessageResponse>((resolve, reject) => {
            deleteUser(user, userId).then(resolve).catch(reject);
        });
    }, [user]);
}
