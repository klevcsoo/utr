import React, {Fragment, useContext} from "react";
import {Spinner} from "@material-tailwind/react";
import {LoadingViewContext} from "./LoadingView";
import {CommonChildrenOnlyProps} from "../../types";

export default function LoadingViewContent(props: CommonChildrenOnlyProps) {
    const context = useContext(LoadingViewContext);

    return context.errorCondition ? null : context.loading ? (
        <div className="w-screen h-screen grid place-content-center fixed inset-0 z-50">
            <div className="p-4 backdrop-blur-xl bg-white bg-opacity-40 rounded-lg border">
                <Spinner className="w-12 h-12"/>
            </div>
        </div>
    ) : (
        <Fragment>
            {props.children}
        </Fragment>
    );
}
