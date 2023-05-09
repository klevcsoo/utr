import {UserRole} from "./UserRole";

export type UserDetails = {
    roles: UserRole[]
    displayName: string
    id: number
    jwtToken: string
}
