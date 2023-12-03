import {ReactNode} from "react";

export interface CommonChildrenOnlyProps {
    children: ReactNode;
}

export interface CommonNameOnlyProps {
    name: string;
}

export type Identifiable<T extends object> = { id: number } & T

export type KeyValueObject<K, V = K> = {
    key: K,
    value: V
}

export type RefreshableLiveData<T> = [
    T extends Array<infer U> ? U[] : T | undefined,
    boolean,
    () => void
]

export type MessageResponse = {
    message: string
}

export type RefreshableContext<T extends object> = T & {
    refresh(key?: keyof T): void;
}
