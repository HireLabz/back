import { Context } from "https://deno.land/x/oak/mod.ts";
import { supabase } from "../config/supabase.config.ts";
import { sendInterviewInvitationEmail } from "../emailService.ts";
import { updateApplicant } from "../services/applicant/applicant.service.ts";

export async function applyForJob(ctx: Context) {
    try {
        const body = ctx.request.body;
        const applicationData = await body.json();

        // First check if job exists and is active
        const { data: job, error: jobError } = await supabase
            .from('jobs')
            .select('*')  // Get all job details
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
                phone_number: applicationData.phone_number,
                email: applicationData.email,
                status: 'pending',
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        // TODO: Remove hardcoded values
        await sendInterviewInvitationEmail({
            company: {
                name: "ElevenLabs",
                logoUrl: "https://eleven-public-cdn.elevenlabs.io/payloadcms/9trrmnj2sj8-logo-logo.svg",
                recruiterCompany: "HireLabz"
            },
            candidate: {
                name: `${applicationData.first_name} ${applicationData.last_name}`
            },
            position: {
                title: job.job_name,
                department: job.job_department,
            },
            interviewer: {
                name: "Matt Alegria",
                role: "Engineering Manager",
                department: "Voice Engineering",
                phoneNumber: "+1 888 411 8583"
            },
            interviewDetails: {
                duration: "15 minutes",
                whatToExpect: "The interview will begin with a brief introduction and discussion about your background. This will be followed by a screening interview where we'll explore some parts of your background. We'll conclude with a Q&A session where you can learn more about the role and our team.",
                topicsToDiscuss: "We will discuss your experience with voice technology, machine learning, and scalable systems. We're particularly interested in hearing about your experience with engineering and how you collaborate with cross-functional teams.",
                preparationResources: [
                    {
                        title: "Learn more about ElevenLabs",
                        link: "https://elevenlabs.io/about"
                    },
                    {
                        title: "Check some of our use-cases",
                        link: "https://elevenlabs.io/use-cases"
                    },
                    {
                        title: "Our docs",
                        link: "https://elevenlabs.io/docs/overview"
                    }
                ]
            }
        },
            applicationData.email
        );

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

        const data = await updateApplicant(applicationId, {
            status: applicationData.status,
            resume_url: applicationData.resume_url,
            linkedin_url: applicationData.linkedin_url,
            portfolio_url: applicationData.portfolio_url,
            phone_number: applicationData.phone_number,
            github_url: applicationData.github_url
        });

        ctx.response.status = 200;
        ctx.response.body = { message: "Application updated successfully", data };
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "Application not found") {
            ctx.response.status = 404;
            ctx.response.body = { error: error.message };
            return;
        }
        console.error("[Applicant Controller] Error:", error);
        ctx.response.status = 500;
        ctx.response.body = { error: "Failed to update application" };
    }
}

