import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { load } from "https://deno.land/std/dotenv/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

// Routes
import { emailRouter } from "./src/routes/email.routes.ts";
import { webhookRouter } from "./src/routes/webhook.routes.ts";
// import { interviewRouter } from "./src/routes/interview.routes.ts";
// import { authRouter } from "./src/routes/auth.routes.ts";

// Middleware
// import { errorHandler } from "./src/middleware/error.middleware.ts";

// Load environment variables
await load({ export: true });

const app = new Application();
const router = new Router();

// Global middleware
app.use(oakCors()); // Enable CORS
// app.use(errorHandler);

// Logger
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.request.method} ${ctx.request.url} - ${ms}ms`);
});

// API routes
router
    .get("/api/health", (ctx) => {
        ctx.response.body = { status: "healthy", timestamp: new Date() };
    });

// Mount routers
app.use(router.routes());
app.use(emailRouter.prefix("/api/email").routes());
app.use(webhookRouter.prefix("/api/webhook").routes());
// app.use(interviewRouter.prefix("/api/interview").routes());
// app.use(authRouter.prefix("/api/auth").routes());

// Error handling
app.addEventListener("error", (evt) => {
    console.error(evt.error);
});

// Start server
const port = Number(Deno.env.get("PORT")) || 8000;
console.log(`Server running on http://localhost:${port}`);

await app.listen({ port }); 