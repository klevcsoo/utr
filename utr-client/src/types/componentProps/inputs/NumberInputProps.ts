export interface NumberInputProps {
    value: number;
    placeholder?: string;
    min?: number;
    max?: number;
    disabled?: boolean;

    onValue(value: number): void;

    onSubmit?(): void;
}
