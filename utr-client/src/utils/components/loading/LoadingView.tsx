import React, {createContext, useState} from "react";
import {CommonChildrenOnlyProps} from "../../types";


interface LoadingLayoutProps extends CommonChildrenOnlyProps {
    condition: boolean;
}

export const LoadingViewContext = createContext<{
    loading: boolean
    errorCondition: boolean
    setErrorCondition(isError: boolean): void
}>({
    loading: true,
    errorCondition: false,
    setErrorCondition(): void {
    }
});

export default function LoadingView(props: LoadingLayoutProps) {
    const [errorCondition, setErrorCondition] = useState(false);

    return (
        <LoadingViewContext.Provider value={{
            errorCondition, setErrorCondition, loading: props.condition
        }}>
            {props.children}
        </LoadingViewContext.Provider>
    );
}
