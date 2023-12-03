import {Input, InputProps} from "@material-tailwind/react";
import React, {RefAttributes, useMemo} from "react";

export interface TextInputProps extends RefAttributes<HTMLInputElement>, Omit<InputProps, "ref"> {
    onSubmit?(): void;

    onValue(val: string): void;
}

export function TextInput(props: TextInputProps) {
    const attributes = useMemo(() => {
        const temp = {...props};
        delete temp["onSubmit"];
        delete (temp as any)["onValue"];
        return temp;
    }, [props]);

    return (
        <Input {...attributes} onChange={event => {
            props.onValue(event.currentTarget.value);
        }} onKeyDown={event => {
            if (event.code === "Enter" && !!props.onSubmit) {
                props.onSubmit();
            }
        }}/>
    );
}
