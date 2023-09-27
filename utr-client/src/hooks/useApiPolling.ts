import {offApiPollEvent, onApiPollEvent} from "../lib/apiPolling";
import {useEffect} from "react";

export default function useApiPolling(fetchCallback: () => void) {
    useEffect(() => {
        onApiPollEvent(fetchCallback);
        return () => offApiPollEvent(fetchCallback);
    }, [fetchCallback]);
}
