import { Router } from "https://deno.land/x/oak/mod.ts";
import { handleTwilioWebhook } from "../controllers/webhook/twilio.controller.ts";
import { handleTwilioStatusWebhook } from "../controllers/webhook/twilio-status.controller.ts";

const router = new Router();

router
    .post("/twilio/interview", handleTwilioWebhook)
    .post("/twilio/status", handleTwilioStatusWebhook);

export const webhookRouter = router; 