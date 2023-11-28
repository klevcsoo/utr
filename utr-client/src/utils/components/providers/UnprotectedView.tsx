import {Fragment} from "react";
import {Navigate} from "react-router-dom";
import {useAuthUser} from "../../../auth/hooks";
import {CommonChildrenOnlyProps} from "../../types";

export function UnprotectedView(props: CommonChildrenOnlyProps) {
    const user = useAuthUser();

    return !user ? <Fragment>{props.children}</Fragment> : <Navigate to="/"/>;
}
