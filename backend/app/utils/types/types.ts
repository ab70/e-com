import type { UserRole } from "../../models/User"

export type TokenType = {
    jwtData: {
        id: string
        email: string,
        type: UserRole
    }
    exp: number
}