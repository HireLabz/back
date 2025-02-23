import { Router } from "https://deno.land/x/oak/mod.ts";
import { handleTwilioWebhook } from "../controllers/webhook/twilio.controller.ts";
import { handleTwilioStatusWebhook } from "../controllers/webhook/twilio-status.controller.ts";
import { callCritic } from "../services/elevenlabs/critic.service.ts";

const router = new Router();

router
    .post("/twilio/interview", handleTwilioWebhook)
    .post("/twilio/status", handleTwilioStatusWebhook)
    
    // Exposing critic service as API for testing
    .post("/critic", async (ctx) => {
        const body = ctx.request.body;
        const data = await body.json();
        const call_id = data.call_id;
        return await callCritic(call_id);
    });

export const webhookRouter = router; 