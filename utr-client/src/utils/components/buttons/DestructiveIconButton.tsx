// noinspection DuplicatedCode

import {Button, Dialog, DialogFooter, DialogHeader, IconButton} from "@material-tailwind/react";
import {Fragment, useCallback, useMemo, useState} from "react";
import {DestructiveButtonProps} from "./DestructiveButton";
import {useTranslation} from "../../../translations/hooks";

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

    const t = useTranslation();
    const [confirmOpen, setConfirmOpen] = useState(false);

    const confirmHandler = useCallback(() => {
        setConfirmOpen(prevState => !prevState);
    }, []);

    return (
        <Fragment>
            <IconButton color="red" onClick={confirmHandler} {...cleanProps as any}>
                {props.children}
            </IconButton>
            <Dialog open={confirmOpen} handler={confirmHandler}>
                <DialogHeader>{props.confirmText}</DialogHeader>
                <DialogFooter className="flex flex-row gap-2">
                    <Button variant="text" onClick={() => {
                        confirmHandler();
                        props.onDismiss && props.onDismiss();
                    }}>
                        {t("generic_label.rather_not")}
                    </Button>
                    <Button variant="filled" color="red" onClick={() => {
                        confirmHandler();
                        props.onConfirm && props.onConfirm();
                    }}>
                        {t("generic_label.lets_go")}
                    </Button>
                </DialogFooter>
            </Dialog>
        </Fragment>
    );
}