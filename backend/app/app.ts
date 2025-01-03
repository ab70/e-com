import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";

const hono = new OpenAPIHono({
    defaultHook: (result, c) => {
        if (result.success) {
            return;
        }

        return c.json({ code: 400, error: result.error }, 400);
    },
});
const app = hono.basePath("/api/ecom");

app.doc("/openapi-json", {
    openapi: "3.1.0",
    info: {
        title: "E-com by DevX",
        version: "v1",
    }
});

app.get("/doc", swaggerUI({ url: "/api/ecom/openapi-json" }));
app.openAPIRegistry.registerComponent("securitySchemes", "SessionCookie", {
    type: "apiKey",
    in: "cookie",
    name: "sessionId",
});

export default app;