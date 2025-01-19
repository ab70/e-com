import { sign } from "hono/jwt";
import { setSignedCookie } from "hono/cookie";
import { signupUser_func } from "./functions/signUp";
import { signinUser_func } from "./functions/signin";
import { createSession } from "../../middlewares/sessionStore";
import type { Context } from "hono";
import { adminSignupUser_func } from "./functions/adminSignUp";
import { vendorAdminSignup_func } from "./functions/vendorAdminSignUp";
import { UserRole } from "../../models/User";

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
                        httpOnly: process.env.production === "true" ? true : false,
                        secure: process.env.production === "true" ? true : false,
                        sameSite: "lax",
                        path: "/",
                        maxAge: 60 * 60 * 24,
                    }
                );

                return c.json({ success: true, message: "Signin successful", user: result.data });
            } catch (err: any) {
                console.log("err", err);
                return c.json({ success: false, message: err.message }, 500);
            }
        },
        // Admin sign up
        async adminSignup(c: Context) {
            try {
                const data = await c.req.json();
                const result = await adminSignupUser_func(data);
                if (!result.success) {
                    return c.json({ success: false, message: result.message }, 400);
                }
                return c.json({ success: true, message: "Admin Signup successful", user: result.data });
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },
        // SignUp vendorAdmin
        async vendorAdminSignup(c: Context) {
            try {
                const data = await c.req.json();
                const userInfo = await c.get("user");
                if (![UserRole.SUPER_ADMIN, UserRole.VENDOR_ADMIN].includes(userInfo.role)) {
                    return c.json({ success: false, message: "You are not allowed to sign up vendorAdmin" }, 400);
                }
                const result = await vendorAdminSignup_func(userInfo, data);
                if (!result.success) {
                    return c.json({ success: false, message: result.message }, 400);
                }
                return c.json({ success: true, message: "Vendor Admin Signup successful", user: result.data });
            } catch (err: any) {
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
