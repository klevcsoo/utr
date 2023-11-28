export interface CommonSelectProps<T> {
    selected: T;

    onSelect(id: T): void;
}
