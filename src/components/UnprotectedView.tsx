import {useAuthUser} from "../hooks/useAuthUser";
import {Fragment, ReactNode} from "react";
import {Navigate} from "react-router-dom";

export function UnprotectedView(props: {
    children: ReactNode
}) {
    const {user} = useAuthUser();

    return !user ? <Fragment>{props.children}</Fragment> : <Navigate to="/"/>;
}
