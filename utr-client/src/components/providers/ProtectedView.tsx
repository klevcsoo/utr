import {Fragment} from "react";
import {useAuthUser} from "../../hooks/auth/useAuthUser";
import {Navigate} from "react-router-dom";
import {CommonChildrenOnlyProps} from "../../types/componentProps/common/CommonChildrenOnlyProps";

export interface ProtectedViewProps extends CommonChildrenOnlyProps {
    accessLevel?: number;
}

export function ProtectedView(props: ProtectedViewProps) {
    const user = useAuthUser();

    return !user ? <Navigate to="/login"/> :
        !!props.accessLevel && props.accessLevel >= user.accessLevel ? <div>unauthorized</div>
            : <Fragment>{props.children}</Fragment>;
}
