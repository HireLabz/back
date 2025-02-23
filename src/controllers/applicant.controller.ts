import { Context } from "https://deno.land/x/oak/mod.ts";
import { supabase } from "../config/supabase.config.ts";

export async function applyForJob(ctx: Context) {
    try {
        const body = ctx.request.body;
        const applicationData = await body.json();

        // First check if job exists and is active
        const { data: job, error: jobError } = await supabase
            .from('jobs')
            .select('id')
            .eq('id', applicationData.job_id)
            .eq('status', true)
            .single();

        if (jobError || !job) {
            ctx.response.status = 404;
            ctx.response.body = { error: "Job not found or inactive" };
            return;
        }

        const { data, error } = await supabase
            .from('applicants')
            .insert({
                job_id: applicationData.job_id,
                first_name: applicationData.first_name,
                last_name: applicationData.last_name,
                resume_url: applicationData.resume_url,
                linkedin_url: applicationData.linkedin_url,
                portfolio_url: applicationData.portfolio_url,
                github_url: applicationData.github_url,
                status: 'pending',
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        ctx.response.status = 201;
        ctx.response.body = { message: "Application submitted successfully", data };
    } catch (error) {
        console.error("[Applicant Controller] Error:", error);
        ctx.response.status = 500;
        ctx.response.body = { error: "Failed to submit application" };
    }
}

export async function listApplications(ctx: Context) {
    try {
        const jobId = ctx.params.jobId;

        const { data, error } = await supabase
            .from('applicants')
            .select(`
                *,
                jobs (
                    job_name,
                    job_description
                )
            `)
            .eq('job_id', jobId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        ctx.response.status = 200;
        ctx.response.body = { data };
    } catch (error) {
        console.error("[Applicant Controller] Error:", error);
        ctx.response.status = 500;
        ctx.response.body = { error: "Failed to fetch applications" };
    }
}

export async function getApplication(ctx: Context) {
    try {
        const applicationId = ctx.params.applicationId;

        const { data, error } = await supabase
            .from('applicants')
            .select(`
                *,
                jobs (
                    job_name,
                    job_description,
                    section_description
                )
            `)
            .eq('id', applicationId)
            .single();

        if (error) throw error;

        if (!data) {
            ctx.response.status = 404;
            ctx.response.body = { error: "Application not found" };
            return;
        }

        ctx.response.status = 200;
        ctx.response.body = { data };
    } catch (error) {
        console.error("[Applicant Controller] Error:", error);
        ctx.response.status = 500;
        ctx.response.body = { error: "Failed to fetch application" };
    }
}

export async function updateApplication(ctx: Context) {
    try {
        const applicationId = ctx.params.applicationId;
        const body = ctx.request.body;
        const applicationData = await body.json();

        // First check if application exists
        const { data: existingApplication, error: checkError } = await supabase
            .from('applicants')
            .select('id')
            .eq('id', applicationId)
            .single();

        if (checkError || !existingApplication) {
            ctx.response.status = 404;
            ctx.response.body = { error: "Application not found" };
            return;
        }

        const { data, error } = await supabase
            .from('applicants')
            .update({
                status: applicationData.status,
                resume_url: applicationData.resume_url,
                linkedin_url: applicationData.linkedin_url,
                portfolio_url: applicationData.portfolio_url,
                github_url: applicationData.github_url,
                updated_at: new Date().toISOString()
            })
            .eq('id', applicationId)
            .select()
            .single();

        if (error) throw error;

        ctx.response.status = 200;
        ctx.response.body = { message: "Application updated successfully", data };
    } catch (error) {
        console.error("[Applicant Controller] Error:", error);
        ctx.response.status = 500;
        ctx.response.body = { error: "Failed to update application" };
    }
}

