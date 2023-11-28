import {Input, InputProps} from "@material-tailwind/react";
import React, {RefAttributes} from "react";

export interface TextInputProps extends RefAttributes<HTMLInputElement>, Omit<InputProps, "ref"> {
    onSubmit?(): void;

    onValue(val: string): void;
}

export function TextInput(props: TextInputProps) {
    return (
        <Input {...props} onChange={event => {
            props.onValue(event.currentTarget.value);
        }} onKeyDown={event => {
            if (event.code === "Enter" && !!props.onSubmit) {
                props.onSubmit();
            }
        }}/>
    );
}
