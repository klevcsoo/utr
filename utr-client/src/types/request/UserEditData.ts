import {PasswordChangeRequest} from "./PasswordChangeRequest";

export type UserEditData = Partial<{
    displayName: string
    roles: string[]
    password: PasswordChangeRequest
}>
