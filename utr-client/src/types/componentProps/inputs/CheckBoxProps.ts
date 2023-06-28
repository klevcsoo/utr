export interface CheckBoxProps {
    value: boolean;
    disabled?: boolean;

    onValue(value: boolean): void;
}
