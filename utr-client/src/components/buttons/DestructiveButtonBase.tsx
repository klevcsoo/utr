import {useTranslation} from "../../hooks/translations/useTranslation";
import {Fragment, useCallback, useState} from "react";
import {Button, Dialog, DialogFooter, DialogHeader} from "@material-tailwind/react";
import {DestructiveButtonProps} from "./DestructiveButtonProps";

export function DestructiveButtonBase(props: DestructiveButtonProps) {
    const t = useTranslation();
    const [confirmOpen, setConfirmOpen] = useState(false);

    const confirmHandler = useCallback((positive?: boolean) => {
        setConfirmOpen(prevState => !prevState);

        if (positive === true && props.onConfirm) {
            props.onConfirm();
        } else if (positive === false && props.onDismiss) {
            props.onDismiss();
        }
    }, [props]);

    return (
        <Fragment>
            {props.children}
            <Dialog open={confirmOpen} handler={confirmHandler}>
                <DialogHeader>{props.confirmText}</DialogHeader>
                <DialogFooter>
                    <Button variant="outlined" onClick={() => confirmHandler(false)}>
                        {t("generic_label.rather_not")}
                    </Button>
                    <Button variant="filled" onClick={() => confirmHandler(true)}>
                        {t("generic_label.lets_go")}
                    </Button>
                </DialogFooter>
            </Dialog>
        </Fragment>
    );
}
