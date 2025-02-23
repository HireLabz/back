import { Router } from "https://deno.land/x/oak/mod.ts";
import { sendInterviewInvitation } from "../controllers/email.controller.ts";

const router = new Router();

router
    .post("/send-invite", sendInterviewInvitation)
    .post("/send-reminder", (ctx) => {
        // TODO: Implement reminder functionality
        ctx.response.status = 501;
        ctx.response.body = { message: "Not implemented yet" };
    });

export const emailRouter = router; 