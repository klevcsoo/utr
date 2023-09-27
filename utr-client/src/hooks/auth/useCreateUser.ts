import {useCallback} from "react";
import {createUser} from "../../lib/api/auth";
import {useAuthUser} from "./useAuthUser";
import {UserCreationData} from "../../types/request/UserCreationData";
import {MessageResponse} from "../../types/response/MessageResponse";

export function useCreateUser() {
    const user = useAuthUser()!;

    return useCallback((data: UserCreationData) => {
        return new Promise<MessageResponse>((resolve, reject) => {
            createUser(user, data).then(resolve).catch(reject);
        });
    }, [user]);
}
