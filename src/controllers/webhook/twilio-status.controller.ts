import { Context } from "https://deno.land/x/oak/mod.ts";
import { callCritic } from "../../services/elevenlabs/critic.service.ts";

interface TwilioStatusCallback {
    CallSid: string;
    CallStatus: string;
    Duration: string;
    Caller: string;
    Timestamp: string;
    [key: string]: string;
}

async function handleCompletedCall(data: TwilioStatusCallback) {
    console.log(`Processing completed call ${data.CallSid}`);
    await callCritic(data.CallSid);
}

export async function handleTwilioStatusWebhook(ctx: Context) {
    try {
        console.log("Received Twilio status webhook");
        const body = ctx.request.body;
        const formData = await body.form();

        // Convert FormData to a regular object
        const data = Object.fromEntries(formData.entries()) as TwilioStatusCallback;
        console.log("Received Twilio status webhook:", data);

        // If call is completed, trigger transcript fetch without waiting
        if (data.CallStatus === "completed") {
            handleCompletedCall(data).catch(error => {
                console.error("Error handling completed call:", error);
            });
        }

        ctx.response.status = 200;
        ctx.response.body = {
            message: "Status webhook received",
            data
        };
    } catch (error: unknown) {
        console.log("Status webhook error:", error);
        ctx.response.status = 500;
        ctx.response.body = {
            error: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error"
        };
    }
} 