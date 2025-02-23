import { Context } from "https://deno.land/x/oak/mod.ts";
import { InterviewConfig } from "../../types/webhook.types.ts";
import { supabase } from "../../config/supabase.config.ts";
// import { supabase } from "../../config/supabase.config.ts";
// import pdf from 'npm:pdf-parse/lib/pdf-parse.js';

// async function extractTextFromPDF(pdfUrl) {
//     const response = await fetch(pdfUrl);
//     const data = await pdf(await response.arrayBuffer());
//     return data.text;    
// }

async function getApplicantAndJobDetails(phoneNumber: string) {
    console.log("Getting applicant and job details from phone number:", phoneNumber);
    const { data: applicant, error } = await supabase
        .from('applicants')
        .select(`
            id,
            first_name,
            last_name,
            job_id,
            jobs (
                job_name,
                job_description
            )
        `)
        .eq('phone_number', phoneNumber)
        .single();

    console.log("applicant: ", applicant);

    if (error || !applicant) {
        console.error('Error fetching applicant:', error);
        throw new Error(`Applicant not found for phone number: ${phoneNumber}`);
    }

    return {
        applicantName: `${applicant.first_name}`,
        jobName: applicant.jobs.job_name,
        jobDescription: applicant.jobs.job_description
    };
}

async function getLogoAsBase64() {
    try {
        const response = await fetch('https://11labs-nonprd-15f22c1d.s3.eu-west-3.amazonaws.com/0b9cd3e1-9fad-4a5b-b3a0-c96b0a1f1d2b/elevenlabs-logo-black.png');
        const arrayBuffer = await response.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        return `data:image/png;base64,${base64}`;
    } catch (error) {
        console.error('Error converting logo to base64:', error);
        return null;
    }
}

export async function handleTwilioWebhook(ctx: Context) {
    try {
        console.log("Received webhook request");
        const body = ctx.request.body;
        const data = await body.json();
        console.log("Webhook data:", JSON.stringify(data, null, 2));

        const {
            caller_id,
            agent_id,
            called_number,
            call_sid
        } = data;

        // Validate webhook data
        if (!caller_id || !agent_id || !called_number || !call_sid) {
            ctx.response.status = 400;
            ctx.response.body = { error: "Missing required fields" };
            return;
        }

        // Get applicant and job details
        const { applicantName, jobName, jobDescription } = await getApplicantAndJobDetails(caller_id);
        const logoBlob = await getLogoAsBase64();

        const interviewConfig: InterviewConfig = {
            dynamic_variables: {
                "section_description": "Section 1: Candidate Past Experiences Section 1 Context: Review notable experiences from the candidate's resume that pertain to the job position.  Section 2: Technical Questions Section 2 Context: Ask technical questions that would be expected for the job position. Include a question on load balancing.  Section 3: Behavioral Questions Section 3 Context: Ask the candidate why they are interested in joining the company and what they look to bring.",
                "job_name": jobName,
                "candidate_resume": "Position: Software Engineer Company: Microsoft Dates: June 2023 - present Summary: Works on Microsoft Loop, a multi-collaborative note-taking application, as part of the Fluid Communications Team. Currently focused on Copilot Pages, developing a collaborative canvas with integrated Copilot chat functionality. Key points: Contributed to Microsoft Loop from public preview to launch Part of specialized team working with Fluid framework Developing communication features and Copilot integration Skills: JavaScript, TypeScript, React, Collaborative Software Development Position: Software Engineer Intern Company: NVIDIA Dates: October - December 2022 Summary: Worked with the Tegra performance team developing low-level performance measurement tools. Created a system daemon for power consumption telemetry and developed its corresponding API. Key points: Built performance measurement tools for Tegra processor Developed background daemon for power consumption monitoring Created API using piped inter-process communication Presented work as computer science capstone project Skills: C/C++, System Programming, API Development, Performance Optimization Position: Brasa Hacks Manager Company: Brazilian Student Association Dates: December 2021 - May 2022 Summary: Organized the organization's first technology conference featuring speakers from major tech companies. Managed a sponsored hackathon with finals held at UC Berkeley. Key points: Coordinated tech conference with industry leaders as speakers Managed sponsored hackathon with in-person finals Led multiple organizational teams Skills: Event Management, Team Leadership, Project Management",
                "candidate_name": applicantName,
                "company_name": "Eleven Labs",
                "job_description": jobDescription,
                "logo": logoBlob
            },
        };

        console.log("Sending response:", JSON.stringify(interviewConfig, null, 2));
        ctx.response.status = 200;
        ctx.response.body = interviewConfig;

    } catch (error: unknown) {
        console.error("Webhook error:", error);
        ctx.response.status = 500;
        ctx.response.body = {
            error: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error"
        };
    }
} 