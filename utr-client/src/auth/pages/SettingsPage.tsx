// noinspection JSUnusedLocalSymbols

import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {TextInput} from "../../utils/components/inputs/TextInput";
import {FullPageModalWithActions} from "../../utils/components/modals/FullPageModalWithActions";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Checkbox,
    Chip,
    ChipProps,
    Dialog,
    Spinner,
    Typography
} from "@material-tailwind/react";
import {DataTable, DataTableDataColumn} from "../../utils/components/data-table";
import {DataTableActionColumn} from "../../utils/components/data-table/DataTableActionColumn";
import {useDeleteUser, useEditUser, useRolesList, useUserDetails, useUsersList} from "../hooks";
import {useTranslation} from "../../translations/hooks";
import {DisplayedUser} from "../types";

const MODAL_PARAM_KEY = "modal";
const USER_ID_PARAM_KEY = "userId";
const USER_PARAM_VALUE = "user";
const USER_PASSWORD_PARAM_VALUE = "userPassword";

export function SettingsPage() {
    return (
        <Fragment>
            <div className="flex flex-col gap-4 w-full">
                <UsersListCard/>
            </div>
            <UserModalContainer/>
        </Fragment>
    );
}

function UsersListCard() {
    const t = useTranslation();
    const [, setSearchParams] = useSearchParams();

    const users = useUsersList();

    const doOpenModal = useCallback(() => {
        setSearchParams(state => {
            state.set(MODAL_PARAM_KEY, USER_PARAM_VALUE);
            state.delete(USER_ID_PARAM_KEY);
            return state;
        });
    }, [setSearchParams]);

    return (
        <Card className="w-full mt-6">
            <CardHeader variant="gradient" color="blue-gray"
                        className="p-4 mb-4 text-center
                            flex flex-row items-center justify-center gap-2">
                <Typography variant="h5">
                    {t("settings.users")}
                </Typography>
            </CardHeader>
            {!!users && !!users.length ? (
                <CardBody>
                    <UsersTable users={users}/>
                </CardBody>
            ) : null}
            <CardFooter>
                <Button color="blue" variant="outlined" onClick={() => doOpenModal()}>
                    {t("actions.user.create")}
                </Button>
            </CardFooter>
        </Card>
    );
}

function UsersTable(props: { users: DisplayedUser[] }) {
    const t = useTranslation();
    const [, setSearchParams] = useSearchParams();
    const deleteUser = useDeleteUser();

    const doOpenModal = useCallback((id: number) => {
        setSearchParams(state => {
            state.set(MODAL_PARAM_KEY, USER_PARAM_VALUE);
            state.set(USER_ID_PARAM_KEY, String(id));
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
        <DataTable dataList={props.users}>
            <DataTableDataColumn list={props.users} forKey="id"
                                 header={t("generic_label.id")}
                                 element={value => (
                                     <Typography variant="small">{value}</Typography>
                                 )}/>
            <DataTableDataColumn list={props.users} forKey="displayName"
                                 header={t("generic_label.name")}
                                 element={value => (
                                     <Typography variant="small" className="font-bold">
                                         {value}
                                     </Typography>
                                 )}/>
            <DataTableDataColumn list={props.users} forKey="username"
                                 header={t("generic_label.username")}
                                 element={value => (
                                     <Typography variant="small">{value}</Typography>
                                 )}/>
            <DataTableDataColumn list={props.users} forKey="roles"
                                 header={t("settings.roles")}
                                 element={value => (
                                     <RoleChips roles={value}/>
                                 )}/>
            <DataTableActionColumn list={props.users} element={entry => (
                <Fragment>
                    <Button variant="text" color="blue-gray" onClick={() => {
                        doOpenModal(entry.id);
                    }}>
                        {t("actions.generic.edit")}
                    </Button>
                    <Button variant="text" color="red" onClick={() => {
                        doDeleteUser(entry.id);
                    }}>
                        {t("actions.generic.delete")}
                    </Button>
                </Fragment>
            )}/>
        </DataTable>
    );
}

function RoleChips(props: { roles: string[] }) {
    const roleColour = useCallback((role: string): ChipProps["color"] => {
        switch (role) {
            case "ROLE_ADMIN":
                return "deep-purple";
            case "ROLE_ALLITOBIRO":
                return "orange";
            case "ROLE_SPEAKER":
                return "light-blue";
            case "ROLE_IDOROGZITO":
                return "green";
        }
    }, []);

    return (
        <div className="flex flex-row gap-2 items-center">
            {props.roles.sort().map((value, index) => (
                <Chip key={index} value={value} variant="ghost"
                      className="w-fit" color={roleColour(value)}/>
            ))}
        </div>
    );
}

function UserModalContainer() {
    const [searchParams, setSearchParams] = useSearchParams();

    const open = useMemo(() => {
        return searchParams.has(MODAL_PARAM_KEY) &&
            searchParams.get(MODAL_PARAM_KEY) === USER_PARAM_VALUE;
    }, [searchParams]);

    const setOpen = useCallback((open: boolean) => {
        setSearchParams(state => {
            if (open) {
                state.set(MODAL_PARAM_KEY, USER_PARAM_VALUE);
            } else {
                state.delete(MODAL_PARAM_KEY);
                state.delete(USER_ID_PARAM_KEY);
            }

            return state;
        });
    }, [setSearchParams]);

    return (
        <Dialog open={open} handler={setOpen}>
            <UserModal close={() => setOpen(false)}/>
        </Dialog>
    );
}

function UserModal(props: { close(): void }) {
    const t = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [user] = useUserDetails(parseInt(
        searchParams.get(USER_ID_PARAM_KEY) ?? "-1"
    ));
    const editUser = useEditUser();

    const [displayName, setDisplayName] = useState("");

    const modalTitle = useMemo(() => {
        return !user ? t("actions.user.create") : t("actions.user.edit");
    }, [t, user]);

    const doOpenPasswordModal = useCallback(() => {
        setSearchParams(state => {
            state.set(MODAL_PARAM_KEY, USER_PASSWORD_PARAM_VALUE);
            return state;
        });
    }, [setSearchParams]);

    const doComplete = useCallback(() => {
        if (!!user && displayName.length > 6) {
            editUser(user.id, {displayName: displayName}).then(messages => {
                messages.forEach(console.log);
                props.close();
            });
        }
    }, [displayName, props, editUser, user]);

    useEffect(() => {
        setDisplayName(user?.displayName ?? "");
    }, [user]);

    return (
        <Card>
            <CardHeader variant="gradient" color="blue-gray"
                        className="p-4 mb-4 text-center
                            flex flex-row items-center justify-center gap-4">
                <Typography variant="h5">
                    {modalTitle}
                </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-8">
                <TextInput value={displayName} onValue={setDisplayName}
                           label={t("generic_label.username")}/>
                <UserRoleSelector user={user}/>
                <Button color="blue" onClick={doOpenPasswordModal}>
                    {t("actions.user.change_password")}
                </Button>
            </CardBody>
            <CardFooter className="flex flex-row gap-2">
                <Button color="blue" variant="outlined" fullWidth
                        onClick={() => props.close()}>
                    {t("generic_label.rather_not")}
                </Button>
                <Button color="blue" variant="filled" fullWidth onClick={doComplete}>
                    {t("generic_label.lets_go")}
                </Button>
            </CardFooter>
        </Card>
    );
}

function UserRoleSelector(props: { user?: DisplayedUser }) {
    const t = useTranslation();

    const roles = useRolesList();
    const editUser = useEditUser();

    const defaultState = useMemo(() => {
        return props.user?.roles.join(";") ?? "";
    }, [props.user?.roles]);

    const [selectedRoles, setSelectedRoles] = useState(defaultState);
    console.log(selectedRoles);

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const doRevertChanges = useCallback(() => {
        setSelectedRoles(defaultState);
    }, [defaultState]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const doSaveChanges = useCallback(() => {
        if (!!props.user) {
            editUser(props.user.id, {
                roles: selectedRoles.split(";")
            }).then(console.log).catch(console.log);
        }
    }, [editUser, props.user, selectedRoles]);

    return (
        <div className="flex flex-col gap-2">
            <div>
                {roles.map((value, index) => (
                    <div key={index} className="flex flex-row gap-2 items-center">
                        <Checkbox checked={selectedRoles.includes(value)}
                                  onChange={() => doUpdateSelectedRoles(value)}
                                  label={value}/>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Button variant="outlined" color="blue-gray">
                    {t("generic_label.revert")}
                </Button>
                <Button color="blue-gray">
                    {t("settings.user_edit.roles.save")}
                </Button>
            </div>
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function UserPasswordChangeModal() {
    const t = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [user, loadingUser] = useUserDetails(parseInt(
        searchParams.get(USER_ID_PARAM_KEY) ?? "-1"
    ));
    const editUser = useEditUser();

    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [newPass2, setNewPass2] = useState("");

    const canComplete = useMemo<boolean>(() => {
        return !!oldPass && !!newPass && newPass === newPass2;
    }, [oldPass, newPass, newPass2]);

    const doDismiss = useCallback(() => {
        setSearchParams(state => {
            state.set(MODAL_PARAM_KEY, USER_PARAM_VALUE);
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
                               type="password"/>
                    <label>{t("settings.user.password.new")}</label>
                    <TextInput value={newPass} onValue={setNewPass}
                               type="password"/>
                    <label>{t("settings.user.password.new_again")}</label>
                    <TextInput value={newPass2} onValue={setNewPass2}
                               type="password"/>
                </form>
            )}
        </FullPageModalWithActions>
    );
}
