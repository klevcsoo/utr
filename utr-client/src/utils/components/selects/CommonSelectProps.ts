export interface CommonSelectProps<T> {
    selected: T;
    disabled?: boolean;

    onSelect(id: T): void;
}
