export type RefreshableLiveData<T> = [
    T extends Array<infer U> ? U[] : T | undefined,
    boolean,
    () => void
]
