import {Fragment} from "react";
import {useAuthUser} from "../../hooks/auth/useAuthUser";
import {Navigate} from "react-router-dom";
import {ProtectedViewProps} from "../../types/componentProps/ProtectedViewProps";

export function ProtectedView(props: ProtectedViewProps) {
    const user = useAuthUser();

    return !user ? <Navigate to="/login"/> :
        !!props.role && !user.roles.includes(props.role) ? <div>unauthorized</div>
            : <Fragment>{props.children}</Fragment>;
}
