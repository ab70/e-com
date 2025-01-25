import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from '@scalar/hono-api-reference'

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
        title: "E-com by AloIt",
        version: "v1",
    }
});

// app.get("/doc", swaggerUI({ url: "/api/ecom/openapi-json" }));
app.get(
    '/doc',
    apiReference({
        theme: 'purple',
        layout: "classic",
        tagsSorter: "alpha",
        servers: [{ url: "http://localhost:5002" }, { url: "https://api.aloit.dev" }],
        favicon: "",
        spec: {
            url: '/api/ecom/openapi-json'
        }
    }),
)
app.openAPIRegistry.registerComponent("securitySchemes", "SessionCookie", {
    type: "apiKey",
    in: "cookie",
    name: "sessionId",
});

export default app;