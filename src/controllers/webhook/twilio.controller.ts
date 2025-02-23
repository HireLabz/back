import { Context } from "https://deno.land/x/oak/mod.ts";
import { InterviewConfig } from "../../types/webhook.types.ts";
import { supabase } from "../../config/supabase.config.ts";
import pdf from 'npm:pdf-parse/lib/pdf-parse.js';

async function extractTextFromPDF(pdfUrl) {
    const response = await fetch(pdfUrl);
    const data = await pdf(await response.arrayBuffer());
    return data.text;    
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

        // Here you would typically:
        // 1. Fetch candidate info based on caller_id
        // 2. Get job details
        // 3. Prepare interview configuration

        // TODO: Fetch candidate info based on caller_id
        // TODO: Get job details

        // Get applicant information
        const {data: applicantData, error: applicantError} = await supabase
            .from('applicants')
            .select()
            .eq('id', 10)
            .single();
            
        if (applicantError) {
            ctx.response.status = 404;
            ctx.response.body = { error: "Applicant not found or inactive" };
            return;
        }

        // Resume parser
        const resume_url = "https://kxqbizpvboywoqamsxde.supabase.co/storage/v1/object/public/applicants%20resume/1740318130146.pdf"
        const resume_text = await extractTextFromPDF(resume_url);

        console.log(resume_text);

        const interviewConfig: InterviewConfig = {
            dynamic_variables: {
                // TODO section descriptin
                "section_description": "Section 1: Candidate Past Experiences Section 1 Context: Review notable experiences from the candidate's resume that pertain to the job position.  Section 2: Technical Questions Section 2 Context: Ask technical questions that would be expected for the job position. Include a question on load balancing.  Section 3: Behavioral Questions Section 3 Context: Ask the candidate why they are interested in joining the company and what they look to bring.",
                // TODO job name
                "job_name": "Full-Stack Engineer",
                "candidate_resume": "Position: Software Engineer Company: Microsoft Dates: June 2023 - present Summary: Works on Microsoft Loop, a multi-collaborative note-taking application, as part of the Fluid Communications Team. Currently focused on Copilot Pages, developing a collaborative canvas with integrated Copilot chat functionality. Key points: Contributed to Microsoft Loop from public preview to launch Part of specialized team working with Fluid framework Developing communication features and Copilot integration Skills: JavaScript, TypeScript, React, Collaborative Software Development Position: Software Engineer Intern Company: NVIDIA Dates: October - December 2022 Summary: Worked with the Tegra performance team developing low-level performance measurement tools. Created a system daemon for power consumption telemetry and developed its corresponding API. Key points: Built performance measurement tools for Tegra processor Developed background daemon for power consumption monitoring Created API using piped inter-process communication Presented work as computer science capstone project Skills: C/C++, System Programming, API Development, Performance Optimization Position: Brasa Hacks Manager Company: Brazilian Student Association Dates: December 2021 - May 2022 Summary: Organized the organization's first technology conference featuring speakers from major tech companies. Managed a sponsored hackathon with finals held at UC Berkeley. Key points: Coordinated tech conference with industry leaders as speakers Managed sponsored hackathon with in-person finals Led multiple organizational teams Skills: Event Management, Team Leadership, Project Management",
                "candidate_name": data.first_name,
                // TODO company name
                "company_name": "Eleven Labs",
                // TODO job description
                "job_description": "About The Role  We are looking for Full-Stack engineers to develop and maintain both front-end and back-end components of our product suite.  Your General Responsibilities Will Include  Building and maintaining our products and platform on top of our cutting-edge voice models, which will be used by millions of users. High degrees of ownership. You will be responsible for shipping end-to-end features across the front and back ends of our stack, as well as helping set the direction of the features and products you're working on. Collaborating closely with others on the Engineering, Growth and Sales teams to understand, and design solutions for, our customer and internal team's most important problems and workflows.   We believe in pairing engineers with work that matches their strengths and interests. This means that there is significant flexibility in staffing engineers across the company.  Specific Responsibilities Might Include  Scoping and building brand new proof of concept products, sometimes directly with partner customers, that could later be scaled to capture entirely new markets. Improving our existing products to ensure that they're intuitive, powerful and make innovative use of our research team's latest break-throughs. This could involve making sweeping UX changes, adding significant functionality, or building integrations with other common consumer/enterprise solutions. Maintaining and strengthening our internal infrastructure as we scale and grow to ensure that our products remain live, performant and secure. Working to collect, manage, and process massive-scale datasets to lay the groundwork for the next generation of voice models at the forefront of generative AI."
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