import { Router } from "https://deno.land/x/oak/mod.ts";
import { handleTwilioWebhook } from "../controllers/webhook/twilio.controller.ts";

const router = new Router();

router.post("/twilio/interview", handleTwilioWebhook);

export const webhookRouter = router; 