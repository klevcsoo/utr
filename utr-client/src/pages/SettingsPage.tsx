import {useSetAdminLayoutTitle} from "../hooks/useSetAdminLayoutTitle";
import {useTranslation} from "../hooks/translations/useTranslation";
import {useUsersList} from "../hooks/auth/useUsersList";
import {DataTable} from "../components/tables/DataTable";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useDeleteUser} from "../hooks/auth/useDeleteUser";
import {useUserDetails} from "../hooks/auth/useUserDetails";
import {TextInput} from "../components/inputs/TextInput";
import {DisplayedUser} from "../types/DisplayedUser";
import {useRolesList} from "../hooks/auth/useRolesList";
import {CheckBox} from "../components/inputs/CheckBox";
import {useEditUser} from "../hooks/auth/useEditUser";
import {FullPageModalWithActions} from "../components/modals/FullPageModalWithActions";
import {Button, Card, IconButton, Spinner} from "@material-tailwind/react";
import {PencilIcon, TrashIcon} from "@heroicons/react/24/solid";
import {DestructiveIconButton} from "../components/buttons";

export function SettingsPage() {
    const t = useTranslation();
    const [searchParams] = useSearchParams();

    useSetAdminLayoutTitle(t("title.admin_layout.settings"));

    return (
        <div className="flex flex-col gap-4 w-full">
            <UsersList/>
            {searchParams.get("modal") === "user" ? (
                <UserModal/>
            ) : searchParams.get("modal") === "user_password" ? (
                <UserPasswordChangeModal/>
            ) : null}
        </div>
    );
}

function UsersList() {
    const t = useTranslation();
    const [, setSearchParams] = useSearchParams();

    const users = useUsersList();
    const deleteUser = useDeleteUser();

    const doOpenUserModal = useCallback((userId?: number) => {
        setSearchParams(state => {
            state.set("modal", "user");
            // noinspection SuspiciousTypeOfGuard
            if (!!userId && typeof userId === "number") {
                state.set("id", String(userId));
            } else if (state.has("id")) {
                state.delete("id");
            }
            return state;
        });
    }, [setSearchParams]);

    const doDeleteUser = useCallback((userId: number) => {
        if (window.confirm(t("confirm.generic.delete"))) {
            deleteUser(userId).then(({message}) => {
                console.log(message);
            }).catch(console.error);
        }
    }, [deleteUser, t]);

    return (
        <div className="flex flex-col gap-2">
            <h3>{t("settings.users")}</h3>
            <DataTable dataList={users} propertyNameOverride={{
                id: t("generic_label.id"),
                displayName: t("generic_label.name"),
                username: t("generic_label.username"),
                roles: t("settings.roles")
            }} actionColumn={entry => (
                <Fragment>
                    <IconButton color="blue-gray" onClick={() => doOpenUserModal(entry.id)}>
                        <PencilIcon className="w-5"/>
                    </IconButton>
                    <DestructiveIconButton confirmText={t("confirm.generic.delete")}
                                           onConfirm={() => doDeleteUser(entry.id)}>
                        <TrashIcon className="w-5"/>
                    </DestructiveIconButton>
                </Fragment>
            )}/>
            <Button color="blue-gray" variant="outlined" onClick={() => doOpenUserModal()}>
                {t("actions.user.create")}
            </Button>
        </div>
    );
}

function UserModal() {
    const t = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [user, loadingUser] = useUserDetails(parseInt(searchParams.get("id") ?? "-1"));
    const editUser = useEditUser();
    const [displayName, setDisplayName] = useState("");

    const modalIcon = useMemo(() => {
        return !user ? "person" : "edit";
    }, [user]);

    const modalTitle = useMemo(() => {
        return !user ? t("actions.user.create") : t("actions.user.edit");
    }, [t, user]);

    const doOpenPasswordModal = useCallback(() => {
        setSearchParams(state => {
            state.set("modal", "user_password");
            return state;
        });
    }, [setSearchParams]);

    const doDismiss = useCallback(() => {
        setSearchParams(state => {
            state.delete("modal");
            state.has("id") && state.delete("id");
            return state;
        });
    }, [setSearchParams]);

    const doComplete = useCallback(() => {
        if (!!user && displayName.length > 6) {
            editUser(user.id, {displayName: displayName}).then(messages => {
                messages.forEach(console.log);
                doDismiss();
            });
        }
    }, [displayName, doDismiss, editUser, user]);

    useEffect(() => {
        setDisplayName(user?.displayName ?? "");
    }, [user]);

    return (
        <FullPageModalWithActions icon={modalIcon} title={modalTitle}
                                  onComplete={doComplete} onDismiss={doDismiss}
                                  className="flex flex-col gap-8 p-6 items-center">
            {loadingUser || !user ? (
                <Spinner/>
            ) : (
                <Fragment>
                    <div className="flex flex-row gap-8 items-center">
                        <label>{t("generic_label.username")}</label>
                        <TextInput value={displayName} onValue={setDisplayName}
                                   placeholder={t("generic_label.username")}/>
                    </div>
                    <UserRoleSelector user={user}/>
                    <Button color="blue-gray" onClick={doOpenPasswordModal}>
                        {t("actions.user.change_password")}
                    </Button>
                </Fragment>
            )}
        </FullPageModalWithActions>
    );
}

function UserRoleSelector(props: { user: DisplayedUser }) {
    const t = useTranslation();

    const roles = useRolesList();
    const editUser = useEditUser();
    const [selectedRoles, setSelectedRoles] = useState<string>(
        props.user.roles.join(";")
    );

    const doUpdateSelectedRoles = useCallback((role: string) => {
        setSelectedRoles(prevState => {
            const a = prevState.split(";");

            if (a.includes(role)) {
                const i = a.indexOf(role);
                a.splice(i, 1);
            } else {
                a.push(role);
            }

            return a.sort().join(";");
        });
    }, []);

    useEffect(() => {
        editUser(props.user.id, {
            roles: selectedRoles.split(";")
        });
    }, [selectedRoles, props.user, editUser]);

    return (
        <div className="flex flex-col gap-2 items-start w-full">
            <h3>{t("settings.user_edit.roles")}</h3>
            <Card className="flex flex-col items-start w-full">
                {roles.map((value, index) => (
                    <div key={index} className="flex flex-row gap-2 items-center">
                        <CheckBox value={selectedRoles.includes(value)}
                                  onValue={() => doUpdateSelectedRoles(value)}/>
                        <label>{value}</label>
                    </div>
                ))}
            </Card>
        </div>
    );
}

function UserPasswordChangeModal() {
    const t = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [user, loadingUser] = useUserDetails(parseInt(searchParams.get("id") ?? "-1"));
    const editUser = useEditUser();

    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [newPass2, setNewPass2] = useState("");

    const canComplete = useMemo<boolean>(() => {
        return !!oldPass && !!newPass && newPass === newPass2;
    }, [oldPass, newPass, newPass2]);

    const doDismiss = useCallback(() => {
        setSearchParams(state => {
            state.set("modal", "user");
            return state;
        });
    }, [setSearchParams]);

    const doComplete = useCallback(() => {
        if (!!user && canComplete) {
            editUser(user.id, {
                password: {
                    oldPassword: oldPass,
                    newPassword: newPass
                }
            }).then(messages => {
                messages.forEach(console.log);
                doDismiss();
            });
        }
    }, [canComplete, doDismiss, editUser, newPass, oldPass, user]);

    return (
        <FullPageModalWithActions icon="lock"
                                  title={t(`actions.user.change_password`)}
                                  onComplete={doComplete} onDismiss={doDismiss}>
            {loadingUser ? (
                <Spinner/>
            ) : (
                <form className="grid grid-cols-2 gap-2 p-6">
                    <label>{t("settings.user.password.old")}</label>
                    <TextInput value={oldPass} onValue={setOldPass}
                               password/>
                    <label>{t("settings.user.password.new")}</label>
                    <TextInput value={newPass} onValue={setNewPass}
                               password/>
                    <label>{t("settings.user.password.new_again")}</label>
                    <TextInput value={newPass2} onValue={setNewPass2}
                               password/>
                </form>
            )}
        </FullPageModalWithActions>
    );
}
