import { Context } from "https://deno.land/x/oak/mod.ts";
import { sendInterviewInvitationEmail } from "../emailService.ts";
import { InterviewInvitationEmailProps } from "../../emails/InterviewInvite.tsx";

export async function sendInterviewInvitation(ctx: Context) {
    try {
        // Get the request body as JSON
        const body = ctx.request.body;
        const { email, invitationData } = await body.json();

        if (!email || !invitationData) {
            ctx.response.status = 400;
            ctx.response.body = { error: "Missing required fields" };
            return;
        }

        const result = await sendInterviewInvitationEmail(
            invitationData as InterviewInvitationEmailProps,
            email
        );

        if (result.success) {
            ctx.response.status = 200;
            ctx.response.body = { message: "Email sent successfully", data: result.data };
        } else {
            ctx.response.status = 500;
            ctx.response.body = { error: "Failed to send email", details: result.error };
        }
    } catch (error: unknown) {
        ctx.response.status = 500;
        ctx.response.body = {
            error: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error"
        };
    }
} 