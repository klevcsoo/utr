import {Fragment} from "react";
import {Navigate} from "react-router-dom";
import {useAuthUser} from "../../../auth/hooks";
import {CommonChildrenOnlyProps} from "../../types";

import {UserRole} from "../../../auth/types";

export interface ProtectedViewProps extends CommonChildrenOnlyProps {
    role?: UserRole;
}

export function ProtectedView(props: ProtectedViewProps) {
    const user = useAuthUser();

    return !user ? <Navigate to="/login"/> :
        !!props.role && !user.roles.includes(props.role) ? <div>unauthorized</div>
            : <Fragment>{props.children}</Fragment>;
}
