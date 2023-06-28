export interface TextInputProps {
    value: string;
    password?: boolean;
    placeholder?: string;
    onSubmit?: () => void;

    onValue(val: string): void;
}
