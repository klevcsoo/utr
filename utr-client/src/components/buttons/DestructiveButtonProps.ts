import {ButtonProps} from "@material-tailwind/react";

export type DestructiveButtonProps = Omit<ButtonProps, "color"> & {
    confirmText: string
    onDismiss?(): void
    onConfirm?(): void
}
