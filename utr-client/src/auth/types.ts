export type PasswordChangeRequest = {
    oldPassword: string
    newPassword: string
}
export type UserCreationData = {
    username: string
    displayName: string
    roles: string[]
    password: string
}
export type UserEditData = Partial<{
    displayName: string
    roles: string[]
    password: PasswordChangeRequest
}>
export type LoginResponse = {
    token: string
    bearer: string
    id: number
    username: string
    displayName: string
    roles: string[]
}
export type UserRole = "admin" | "allitobiro" | "idorogzito" | "speaker"
export type AuthUser = {
    roles: UserRole[]
    displayName: string
    id: number
    jwtToken: string
}
export type DisplayedUser = {
    id: number
    username: string
    displayName: string
    roles: string[]
}
