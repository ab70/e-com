import { cors } from "hono/cors";
import app from "./app/app";
import "./app/routes/api";
import "./app/db/db"
const PORT = process.env.PORT || 6002;
// preflight cors handle
app.options("*", cors({
  origin: "*",
}));
app.use(cors({
  origin: "*"
}));
// Middleware to handle session for each request

// import("./app/events/consumers/index")
console.log(`E-COM service started on port http://localhost:${PORT}/api/ecom/doc`);

export default {
  fetch: app.fetch,
  port: PORT
}
