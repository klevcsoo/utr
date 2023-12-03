import {Fragment, useContext, useEffect} from "react";
import {LoadingViewContext} from "./LoadingView";
import {CommonChildrenOnlyProps} from "../../types";

interface LoadingViewErrorProps extends CommonChildrenOnlyProps {
    condition: boolean;
}

export function LoadingViewError(props: LoadingViewErrorProps) {
    const context = useContext(LoadingViewContext);

    useEffect(() => {
        context.setErrorCondition(props.condition);
    }, [props, context]);

    return context.loading || !props.condition ? null : (
        <Fragment>
            {props.children}
        </Fragment>
    );
}
