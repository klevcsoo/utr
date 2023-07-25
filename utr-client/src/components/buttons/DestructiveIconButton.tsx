import {IconButton} from "@material-tailwind/react";
import {DestructiveButtonProps} from "./DestructiveButtonProps";
import {DestructiveButtonBase} from "./DestructiveButtonBase";
import {useMemo} from "react";

export function DestructiveIconButton(props: DestructiveButtonProps) {
    const cleanProps = useMemo(() => {
        const p = {};

        for (const key of Object.keys(props)) {
            if (["confirmText", "onDismiss", "onConfirm"].includes(key)) {
                continue;
            }

            (p as any)[key] = (props as any)[key];
        }

        return p;
    }, [props]);

    return (
        <DestructiveButtonBase {...props}>
            <IconButton color="red" {...cleanProps as any}>{props.children}</IconButton>
        </DestructiveButtonBase>
    );
}
