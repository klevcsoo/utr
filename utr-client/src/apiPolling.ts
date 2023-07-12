import {apiPollingRateMs} from "./config";

const apiPollEventListeners: Array<() => void> = [];

let lastUpdate: number | undefined = undefined;
const broadcastApiPollEvent = (time: number) => {
    if (!lastUpdate || time - lastUpdate > apiPollingRateMs) {
        apiPollEventListeners.forEach(l => l());
        lastUpdate = time;
    }
    requestAnimationFrame(broadcastApiPollEvent);
};

export function startApiPollEventTimer() {
    requestAnimationFrame(broadcastApiPollEvent);
}

export function onApiPollEvent(listener: () => void) {
    if (!apiPollEventListeners.includes(listener)) {
        apiPollEventListeners.push(listener);
        listener();
    }
}

export function offApiPollEvent(listener: () => void) {
    if (apiPollEventListeners.includes(listener)) {
        const i = apiPollEventListeners.indexOf(listener);
        apiPollEventListeners.splice(i, 1);
    }
}
