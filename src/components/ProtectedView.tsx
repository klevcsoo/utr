import {Fragment, ReactNode} from "react";
import {useAuthUser} from "../hooks/auth/useAuthUser";
import {UserRole} from "../types/UserRole";
import {Navigate} from "react-router-dom";

export function ProtectedView(props: {
    children: ReactNode
    role?: UserRole
}) {
    const {user} = useAuthUser();

    return !user ? <Navigate to="/login"/> :
        !!props.role && !user.roles.includes(props.role) ? <div>unauthorized</div>
            : <Fragment>{props.children}</Fragment>;
}
