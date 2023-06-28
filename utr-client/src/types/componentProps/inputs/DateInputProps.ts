export interface DateInputProps {
    value: number;
    min?: number;
    max?: number;

    onValue(date: number): void;
}
