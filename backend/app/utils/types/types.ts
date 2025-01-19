import type { UserRole } from "../../models/User"

export type TokenType = {
    jwtData: {
        id: string
        email: string,
        type: UserRole
    }
    exp: number
}

export interface IPagination {
    page: number;
    pageSize: number;
    limit?: number;
    all?: string;
}

export const DefaultPagination: IPagination = {
    page: 1,
    pageSize: 10,
    limit: 10,
    all: "false",
};