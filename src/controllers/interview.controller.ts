import { Context } from "https://deno.land/x/oak/mod.ts";
import { createInterview, getInterviewWithAnalysis } from "../services/interview/interview.service.ts";

export async function createInterviewHandler(ctx: Context) {
    try {
        const body = ctx.request.body;
        const interviewData = await body.json();

        const interview = await createInterview(interviewData);

        if (!interview) {
            ctx.response.status = 500;
            ctx.response.body = { error: "Failed to create interview" };
            return;
        }

        ctx.response.status = 201;
        ctx.response.body = { message: "Interview created successfully", data: interview };
    } catch (error) {
        console.error("[Interview Controller] Error:", error);
        ctx.response.status = 500;
        ctx.response.body = { error: "Failed to create interview" };
    }
}

export async function getInterviewWithAnalysisHandler(ctx: Context) {
    try {
        const interviewId = ctx.params.interviewId;
        const interview = await getInterviewWithAnalysis(interviewId);

        if (!interview) {
            ctx.response.status = 404;
            ctx.response.body = { error: "Interview not found" };
            return;
        }

        ctx.response.status = 200;
        ctx.response.body = { data: interview };
    } catch (error) {
        console.error("[Interview Controller] Error:", error);
        ctx.response.status = 500;
        ctx.response.body = { error: "Failed to fetch interview" };
    }
} 