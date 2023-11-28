import InputMask, {Props} from "react-input-mask";
import {Input} from "@material-tailwind/react";
import {FC, ReactNode} from "react";

export interface IntervalMaskedInputProps {
    value: string | undefined;
    disabled?: boolean;
    label?: string;

    onValue(val: string): void;

    onSubmit?(): void;
}

type TInputMaskCorrect = Omit<Props, 'children'> & { children?: () => JSX.Element };

const InputMaskCorrect: FC<TInputMaskCorrect> = ({children, ...props}) => {
    const child = children as ReactNode;
    return <InputMask children={child} {...props} />;
};

export function IntervalMaskedInput(props: IntervalMaskedInputProps) {
    return (
        <InputMaskCorrect mask="9:99.999" value={props.value} onChange={event => {
            props.onValue(event.currentTarget.value);
        }} onKeyDown={event => {
            if (event.code === "Enter" && props.onSubmit) {
                props.onSubmit();
            }
        }} disabled={props.disabled}>
            {() => (
                <Input type="text" label={props.label} disabled={props.disabled}/>
            )}
        </InputMaskCorrect>
    );
}
