import { Context } from "https://deno.land/x/oak/mod.ts";
import { callCritic } from "../../services/elevenlabs/critic.service.ts";
import { supabase } from "../../config/supabase.config.ts";

interface TwilioStatusCallback {
    CallSid: string;
    CallStatus: string;
    Duration: string;
    Caller: string;
    Timestamp: string;
    [key: string]: string;
}

async function getApplicantIdFromPhone(phoneNumber: string): Promise<string> {
    console.log("Getting applicant ID from phone number:", phoneNumber);
    const { data: applicant, error } = await supabase
        .from('applicants')
        .select('id')
        .eq('phone_number', phoneNumber)
        .single();
    console.log("applicant: ", applicant);
    if (error || !applicant) {
        console.error('Error fetching applicant:', error);
        throw new Error(`Applicant not found for phone number: ${phoneNumber}`);
    }

    return applicant.id;
}

async function handleCompletedCall(data: TwilioStatusCallback) {
    console.log(`Processing completed call ${data.CallSid}`);

    // Get applicant ID from the caller's phone number
    const applicantId = await getApplicantIdFromPhone(data.Caller);
    await callCritic(data.CallSid, applicantId);
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