import {offApiPollEvent, onApiPollEvent} from "../apiPolling";
import {useEffect} from "react";

export function useApiPolling(fetchCallback: () => void) {
    useEffect(() => {
        onApiPollEvent(fetchCallback);
        return () => offApiPollEvent(fetchCallback);
    }, [fetchCallback]);
}
