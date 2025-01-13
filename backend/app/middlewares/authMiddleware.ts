import type { Context } from "hono";
import { getSignedCookie } from "hono/cookie";
import { verify } from "hono/jwt";
// import { TokenType, UserRole } from "../utils/types/types";
import { getSession } from "./sessionStore";
import { User, UserRole } from "../models/User";
import type { TokenType } from "../utils/types/types";

export const checkUser = async (c: Context, next: any) => {
    try {
        const token = await getSignedCookie(c, process.env.JWT_SECRET || '', 'ecom_token');
        console.log("c", await c.req.parseBody({ all: true }));

        if (token) {
            const decodedToken: TokenType = await verify(token, process.env.JWT_SECRET || '') as TokenType;
            let userInfo: any = null;
            if (!decodedToken.jwtData) return c.json({ success: false, message: "Not authorized" })
            const sessionData = await getSession(decodedToken?.jwtData?.id);
            if (!sessionData) return c.json({ success: false, message: "Not authorized" }, 401);
            userInfo = await User.findOne({ _id: sessionData?.user_Id });
            c.set('user', userInfo)

            c.set('session', {
                _id: userInfo?._id,
                email: userInfo?.email,
                firstName: userInfo?.firstName,
                lastName: userInfo.lastName,
                role: userInfo.role,
                mfaEnabled: userInfo?.mfaEnabled
            })

            await next()
        }
        return c.json({ success: false, message: "Not authorized" })
    } catch (err: any) {
        console.log(err);

        return c.json({ success: false, message: err.message }, 500)
    }
}

export const checkAdmin = async (c: Context, next: any) => {
    try {
        const token = await getSignedCookie(c, process.env.JWT_SECRET || '', 'ecom_token');
        console.log("c", await c.req.parseBody({ all: true }));

        if (token) {
            const decodedToken: TokenType = await verify(token, process.env.JWT_SECRET || '') as TokenType;
            let userInfo = null;
            if (!decodedToken.jwtData) return c.json({ success: false, message: "Not authorized" })
            const sessionData = await getSession(decodedToken?.jwtData?.id);
            if (!sessionData) return c.json({ success: false, message: "Not authorized" }, 401);
            userInfo = await User.findOne({ _id: sessionData?.user_Id });
            c.set('user', userInfo)

            c.set('session', {
                _id: userInfo?._id,
                email: userInfo?.email,
                firstName: userInfo?.firstName,
                lastName: userInfo?.lastName,
                role: userInfo?.role,
                mfaEnabled: userInfo?.mfaEnabled
            })
            if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(userInfo?.role as any)) {
                return c.json({ success: false, message: "Unauthorized" }, 401)
            }

            await next()
        }
        return c.json({ success: false, message: "Not authorized" })
    } catch (err: any) {
        console.log(err);

        return c.json({ success: false, message: err.message }, 500)
    }
}