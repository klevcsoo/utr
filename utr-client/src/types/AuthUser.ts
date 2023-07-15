import {UserRole} from "./UserRole";

export type AuthUser = {
    roles: UserRole[]
    displayName: string
    id: number
    jwtToken: string
}
