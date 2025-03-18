import app from "../../app";
import { z } from "@hono/zod-openapi";
import { checkVendor } from "../../middlewares/authMiddleware";
import { Get, Patch, Post } from "../../utils/swagger/methods"

import { ContactUsPostSchema } from "../../models/ContactUs";
import contactUsControllers from "../../controllers/contactUsControllers/contactUsController";

// Create Contact Us
app.openapi(Post({ path: "/contact-us/craete", tags: ["Contact Us"], schema: ContactUsPostSchema }), contactUsControllers().createContactUs);
// Get all Contact Uss
app.openapi(Get({
    path: "/contact-us/get", query: z.object({
        page: z.string().default("1"),
        pageSize: z.string().default("10"),
        all: z.string().optional().default("false")
    }), tags: ["Contact Us"], middleware: [checkVendor]
}), contactUsControllers().getAllContactUs);
// Edit Contact Us
app.openapi(Patch({ path: "/contact-us/edit", query: z.object({ id: z.string() }), tags: ["Contact Us"], middleware: [checkVendor], schema: ContactUsPostSchema }), contactUsControllers().updateContactUs);
