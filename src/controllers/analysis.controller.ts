import { Context } from "https://deno.land/x/oak/mod.ts";
import { supabase } from "../config/supabase.config.ts";

export async function createAnalysis(ctx: Context) {
    try {
        const body = ctx.request.body;
        const analysisData = await body.json();

        // First check if interview exists
        const { data: interview, error: interviewError } = await supabase
            .from('interviews')
            .select('id')
            .eq('id', analysisData.interview_id)
            .single();

        if (interviewError || !interview) {
            ctx.response.status = 404;
            ctx.response.body = { error: "Interview not found" };
            return;
        }

        const { data, error } = await supabase
            .from('analysis')
            .insert({
                interview_id: analysisData.interview_id,
                skill_name: analysisData.skill_name,
                skill_score: analysisData.skill_score,
                skill_reasoning: analysisData.skill_reasoning,
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        ctx.response.status = 201;
        ctx.response.body = { message: "Analysis created successfully", data };
    } catch (error) {
        console.error("[Analysis Controller] Error:", error);
        ctx.response.status = 500;
        ctx.response.body = { error: "Failed to create analysis" };
    }
}

export async function getAnalysis(ctx: Context) {
    try {
        const analysisId = ctx.params.analysisId;

        const { data, error } = await supabase
            .from('analysis')
            .select('*')
            .eq('id', analysisId)
            .single();

        if (error) throw error;

        if (!data) {
            ctx.response.status = 404;
            ctx.response.body = { error: "Analysis not found" };
            return;
        }

        ctx.response.status = 200;
        ctx.response.body = { data };
    } catch (error) {
        console.error("[Analysis Controller] Error:", error);
        ctx.response.status = 500;
        ctx.response.body = { error: "Failed to fetch analysis" };
    }
} 