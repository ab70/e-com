import app from "../../app";
import authControllers from "../../controllers/authControllers/authController";
// import { authController } from "../../controllers/auth/authController";
// import { loginPostSchema, orgLoginPostSchema } from "../../utils/types/types";
import { checkUser } from "../../middlewares/authMiddleware";
import { loginPostSchema, UserPostSchema } from "../../models/User";
import { Get, Post } from "../../utils/swagger/methods"

app.openapi(Post({ path: "/signup", tags: ["Auth"], schema: UserPostSchema }), authControllers().signup);
app.openapi(Post({ path: "/login", tags: ["Auth"], schema: loginPostSchema }), authControllers().signin );
// get user info
app.openapi(Get({ path: "/user", tags: ["User"], middleware: [checkUser] }), authControllers().getCurrentUser);