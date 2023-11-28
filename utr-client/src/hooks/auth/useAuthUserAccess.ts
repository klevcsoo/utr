import {useAuthUser} from ".";

export default function useAuthUserAccess(accessLevel?: number): boolean {
    const user = useAuthUser();
    return (user?.accessLevel ?? 0) >= (accessLevel ?? 0);
}
