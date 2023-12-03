import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {AuthContext, createUser, deleteUser, editUser, getAllUsers, getUser} from "./api";
import {DisplayedUser, UserCreationData, UserEditData} from "./types";
import {MessageResponse} from "../utils/types";

export function useAuthLogin() {
    return useContext(AuthContext).login;
}

export function useAuthLogout() {
    return useContext(AuthContext).logout;
}

export function useAuthUser() {
    return useContext(AuthContext).user;
}

export function useCreateUser() {
    const user = useAuthUser()!;

    return useCallback((data: UserCreationData) => {
        return new Promise<MessageResponse>((resolve, reject) => {
            createUser(user, data).then(resolve).catch(reject);
        });
    }, [user]);
}

export function useDeleteUser() {
    const user = useAuthUser()!;

    return useCallback((userId: number) => {
        return new Promise<MessageResponse>((resolve, reject) => {
            deleteUser(user, userId).then(resolve).catch(reject);
        });
    }, [user]);
}

export function useEditUser() {
    const user = useAuthUser()!;

    return useCallback((userId: number, data: UserEditData) => {
        return new Promise<MessageResponse[]>((resolve, reject) => {
            editUser(user, userId, data).then(resolve).catch(reject);
        });
    }, [user]);
}

export function useRolesList() {
    return useMemo<string[]>(() => {
        return ["ROLE_ADMIN", "ROLE_IDOROGZITO", "ROLE_ALLITOBIRO", "ROLE_SPEAKER"];
    }, []);
}

export function useUserDetails(userId?: number): [DisplayedUser | undefined, boolean] {
    const user = useAuthUser()!;
    const [details, setDetails] = useState<DisplayedUser>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!!userId) {
            getUser(user, userId)
                .then(setDetails)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [user, userId]);

    return [details, loading];
}

export function useUsersList(): DisplayedUser[] {
    const user = useAuthUser()!;
    const [list, setList] = useState<DisplayedUser[]>([]);

    useEffect(() => {
        getAllUsers(user).then(setList).catch(console.error);
    }, [user]);

    return list;
}
