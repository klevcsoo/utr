import {useAuthUser} from "./useAuthUser";

export function useAuthUserAccess(accessLevel?: number): boolean {
    const user = useAuthUser();
    return (user?.accessLevel ?? 0) >= (accessLevel ?? 0);
}
