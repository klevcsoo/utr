import {Fragment} from "react";
import {Navigate} from "react-router-dom";
import {CommonChildrenOnlyProps} from "../../types/componentProps/common/CommonChildrenOnlyProps";
import {useAuthUser, useAuthUserAccess} from "../../hooks/auth";

export interface ProtectedViewProps extends CommonChildrenOnlyProps {
    accessLevel?: number;
}

export function ProtectedView(props: ProtectedViewProps) {
    const user = useAuthUser();
    const hasAccess = useAuthUserAccess(props.accessLevel);

    return !user ? <Navigate to="/login"/> : hasAccess ? <div>unauthorized</div>
        : <Fragment>{props.children}</Fragment>;
}
