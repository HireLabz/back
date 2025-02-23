import { Context } from "https://deno.land/x/oak/mod.ts";
import { supabase } from "../config/supabase.config.ts";

export async function createJob(ctx: Context) {
    try {
        const body = ctx.request.body;
        const jobData = await body.json();

        const { data, error } = await supabase
            .from('jobs')
            .insert({
                job_name: jobData.job_name,
                job_description: jobData.job_description,
                section_description: jobData.section_description,
                status: true, // active by default
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        ctx.response.status = 201;
        ctx.response.body = { message: "Job created successfully", data };
    } catch (error) {
        console.error("[Job Controller] Error:", error);
        ctx.response.status = 500;
        ctx.response.body = { error: "Failed to create job" };
    }
}

export async function listActiveJobs(ctx: Context) {
    try {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('status', true)
            .order('created_at', { ascending: false });

        if (error) throw error;

        ctx.response.status = 200;
        ctx.response.body = { data };
    } catch (error) {
        console.error("[Job Controller] Error:", error);
        ctx.response.status = 500;
        ctx.response.body = { error: "Failed to fetch jobs" };
    }
}

export async function updateJob(ctx: Context) {
    try {
        const jobId = ctx.params.jobId;
        const body = ctx.request.body;
        const jobData = await body.json();

        // First check if job exists
        const { data: existingJob, error: checkError } = await supabase
            .from('jobs')
            .select('id')
            .eq('id', jobId)
            .single();

        if (checkError || !existingJob) {
            ctx.response.status = 404;
            ctx.response.body = { error: "Job not found" };
            return;
        }

        const { data, error } = await supabase
            .from('jobs')
            .update({
                job_name: jobData.job_name,
                job_description: jobData.job_description,
                section_description: jobData.section_description,
                status: jobData.status,
                updated_at: new Date().toISOString()
            })
            .eq('id', jobId)
            .select()
            .single();

        if (error) throw error;

        ctx.response.status = 200;
        ctx.response.body = { message: "Job updated successfully", data };
    } catch (error) {
        console.error("[Job Controller] Error:", error);
        ctx.response.status = 500;
        ctx.response.body = { error: "Failed to update job" };
    }
}

export async function deleteJob(ctx: Context) {
    try {
        const jobId = ctx.params.jobId;

        // First check if job exists
        const { data: existingJob, error: checkError } = await supabase
            .from('jobs')
            .select('id')
            .eq('id', jobId)
            .single();

        if (checkError || !existingJob) {
            ctx.response.status = 404;
            ctx.response.body = { error: "Job not found" };
            return;
        }

        const { error } = await supabase
            .from('jobs')
            .delete()
            .eq('id', jobId);

        if (error) throw error;

        ctx.response.status = 200;
        ctx.response.body = { message: "Job deleted successfully" };
    } catch (error) {
        console.error("[Job Controller] Error:", error);
        ctx.response.status = 500;
        ctx.response.body = { error: "Failed to delete job" };
    }
} 