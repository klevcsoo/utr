export interface IntervalMaskedInputProps {
    value: string | undefined;
    disabled?: boolean;

    onValue(val: string): void;

    onSubmit?(): void;
}
