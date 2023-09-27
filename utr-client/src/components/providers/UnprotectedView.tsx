import {Fragment} from "react";
import {Navigate} from "react-router-dom";
import {CommonChildrenOnlyProps} from "../../types/componentProps/common/CommonChildrenOnlyProps";
import {useAuthUser} from "../../hooks/auth";

export function UnprotectedView(props: CommonChildrenOnlyProps) {
    const user = useAuthUser();

    return !user ? <Fragment>{props.children}</Fragment> : <Navigate to="/"/>;
}
