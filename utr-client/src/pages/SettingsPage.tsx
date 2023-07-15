import {useSetAdminLayoutTitle} from "../hooks/useSetAdminLayoutTitle";
import {useTranslation} from "../hooks/translations/useTranslation";
import {useUsersList} from "../hooks/auth/useUsersList";
import {DataTable} from "../components/tables/DataTable";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {IconButton} from "../components/inputs/buttons/IconButton";
import {IconWarningButton} from "../components/inputs/buttons/IconWarningButton";
import {useSearchParams} from "react-router-dom";
import {useDeleteUser} from "../hooks/auth/useDeleteUser";
import {SecondaryButton} from "../components/inputs/buttons/SecondaryButton";
import {FullPageModal} from "../components/modals/FullPageModal";
import {TitleIcon} from "../components/icons/TitleIcon";
import {PrimaryButton} from "../components/inputs/buttons/PrimaryButton";
import {useUserDetails} from "../hooks/auth/useUserDetails";
import {LoadingSpinner} from "../components/LoadingSpinner";
import {TextInput} from "../components/inputs/TextInput";
import {DisplayedUser} from "../types/DisplayedUser";
import {useRolesList} from "../hooks/auth/useRolesList";
import {CheckBox} from "../components/inputs/CheckBox";
import {BorderCard} from "../components/containers/BorderCard";
import {useEditUser} from "../hooks/auth/useEditUser";

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
                    <IconButton iconName="edit" onClick={() => {
                        doOpenUserModal(entry.id);
                    }}/>
                    <IconWarningButton iconName="delete" onClick={() => {
                        doDeleteUser(entry.id);
                    }}/>
                </Fragment>
            )}/>
            <SecondaryButton text={t("actions.user.create")}
                             onClick={doOpenUserModal}/>
        </div>
    );
}

function UserModal() {
    const t = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [user, loadingUser] = useUserDetails(parseInt(searchParams.get("id") ?? "-1"));
    const editUser = useEditUser();
    const [displayName, setDisplayName] = useState("");

    const doOpenPasswordModal = useCallback(() => {
        setSearchParams(state => {
            state.set("modal", "user_password");
            return state;
        });
    }, [setSearchParams]);

    const doCloseModal = useCallback(() => {
        setSearchParams(state => {
            state.delete("modal");
            state.has("id") && state.delete("id");
            return state;
        });
    }, [setSearchParams]);

    const doCommitChanges = useCallback(() => {
        if (!!user && displayName.length > 6) {
            editUser(user.id, {displayName: displayName}).then(messages => {
                messages.forEach(console.log);
                doCloseModal();
            });
        }
    }, [displayName, doCloseModal, editUser, user]);

    useEffect(() => {
        setDisplayName(user?.displayName ?? "");
    }, [user]);

    return (
        <FullPageModal className="flex flex-col">
            {loadingUser || !user ? (
                <LoadingSpinner/>
            ) : (
                <Fragment>
                    <div className="flex flex-row items-center justify-start gap-6 p-6
                    min-w-max max-w-sm">
                        <TitleIcon name={!user ? "person" : "edit"}/>
                        <h2>{t(`actions.user.${!user ? "create" : "edit"}`)}</h2>
                    </div>
                    <div className="w-full border border-slate-100"></div>
                    <div className="flex flex-col gap-8 p-6 items-center">
                        <div className="flex flex-row gap-8 items-center">
                            <label>{t("generic_label.username")}</label>
                            <TextInput value={displayName} onValue={setDisplayName}
                                       placeholder={t("generic_label.username")}/>
                        </div>
                        <UserRoleSelector user={user}/>
                        <SecondaryButton text={t("actions.user.change_password")}
                                         onClick={doOpenPasswordModal}/>
                    </div>
                    <div className="flex flex-row gap-2 p-6">
                        <SecondaryButton text={t("generic_label.rather_not")}
                                         onClick={doCloseModal}/>
                        <PrimaryButton text={t("generic_label.lets_go")}
                                       onClick={doCommitChanges}/>
                    </div>
                </Fragment>
            )}
        </FullPageModal>
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
            <BorderCard className="flex flex-col items-start w-full">
                {roles.map((value, index) => (
                    <div key={index} className="flex flex-row gap-2 items-center">
                        <CheckBox value={selectedRoles.includes(value)}
                                  onValue={() => doUpdateSelectedRoles(value)}/>
                        <label>{value}</label>
                    </div>
                ))}
            </BorderCard>
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

    const canCommit = useMemo<boolean>(() => {
        return !!oldPass && !!newPass && newPass === newPass2;
    }, [oldPass, newPass, newPass2]);

    const doCloseModal = useCallback(() => {
        setSearchParams(state => {
            state.set("modal", "user");
            return state;
        });
    }, [setSearchParams]);

    const doCommitChanges = useCallback(() => {
        if (!!user && canCommit) {
            editUser(user.id, {
                password: {
                    oldPassword: oldPass,
                    newPassword: newPass
                }
            }).then(messages => {
                messages.forEach(console.log);
                doCloseModal();
            });
        }
    }, [canCommit, doCloseModal, editUser, newPass, oldPass, user]);

    return (
        <FullPageModal className="flex flex-col">
            {loadingUser || !user ? (
                <LoadingSpinner/>
            ) : (
                <Fragment>
                    <div className="flex flex-row items-center justify-start gap-6 p-6
                    min-w-max max-w-sm">
                        <TitleIcon name="lock"/>
                        <h2>{t(`actions.user.change_password`)}</h2>
                    </div>
                    <div className="w-full border border-slate-100"></div>
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
                    <div className="flex flex-row gap-2 p-6">
                        <SecondaryButton text={t("generic_label.rather_not")}
                                         onClick={doCloseModal}/>
                        <PrimaryButton text={t("generic_label.lets_go")}
                                       onClick={doCommitChanges}
                                       disabled={!canCommit}/>
                    </div>
                </Fragment>
            )}
        </FullPageModal>
    );
}
