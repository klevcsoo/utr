export const serverURL = process.env.REACT_APP_UTR_SERVER_HREF;
export const artificialAPIDelay = process.env.REACT_APP_LOCALHOST_API_DELAY === "true";
export const packageVersion = process.env.REACT_APP_PACKAGE_VERSION;
export const apiPollingRateMs = parseInt(process.env.REACT_APP_API_POLLING_RATE_MS ?? "2000");
