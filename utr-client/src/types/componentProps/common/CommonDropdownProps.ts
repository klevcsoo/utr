export interface CommonDropdownProps<T> {
    selected: T;

    onSelect(id: T): void;
}
