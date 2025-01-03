import { sign } from "hono/jwt";
import { setSignedCookie } from "hono/cookie";
import { signupUser_func } from "./functions/signUp";
import { signinUser_func } from "./functions/signin";
import { createSession } from "../../middlewares/sessionStore";
import type { Context } from "hono";

function authControllers() {
    return {
        // User Signup
        async signup(c: Context) {
            try {
                const data = await c.req.json();
                const result = await signupUser_func(data);

                if (!result.success) {
                    return c.json({ success: false, message: result.message }, 400);
                }

                return c.json({ success: true, message: "Signup successful", user: result.data });
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },

        // User Signin
        async signin(c: Context) {
            try {
                const data = await c.req.json();
                const result = await signinUser_func(data);

                if (!result.success || !result.data) {
                    return c.json({ success: false, message: result.message }, 401);
                }

                const jwtData = {
                    id: result.data._id,
                    email: result.data.email,
                    role: result.data.role,
                };

                const accessToken = await sign(
                    { jwtData, exp: Date.now() + 60 * 60 * 15 },
                    process.env.JWT_SECRET as string
                );
                
                await createSession(result.data._id as string, { accessToken });

                await setSignedCookie(
                    c,
                    "ecom_token",
                    accessToken,
                    process.env.JWT_SECRET as string,
                    {
                        httpOnly: true,
                        secure: true,
                        sameSite: "lax",
                        path: "/",
                        maxAge: 60 * 60 * 24, // 24 hours
                    }
                );

                return c.json({ success: true, message: "Signin successful", user: result.data });
            } catch (err: any) {
                console.log("err", err);
                return c.json({ success: false, message: err.message }, 500);
            }
        },

        // Get Current User Info
        async getCurrentUser(c: Context) {
            try {
                const userInfo = c.get("user");
                return c.json({ success: true, message: "User info found", data: userInfo });
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },
    };
}

export default authControllers;
