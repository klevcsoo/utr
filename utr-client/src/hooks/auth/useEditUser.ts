import {useCallback} from "react";
import {useAuthUser} from "./useAuthUser";
import {editUser} from "../../api/auth";
import {UserEditData} from "../../types/request/UserEditData";
import {MessageResponse} from "../../types/response/MessageResponse";

export function useEditUser() {
    const user = useAuthUser()!;

    return useCallback((userId: number, data: UserEditData) => {
        return new Promise<MessageResponse[]>((resolve, reject) => {
            editUser(user, userId, data).then(resolve).catch(reject);
        });
    }, [user]);
}
