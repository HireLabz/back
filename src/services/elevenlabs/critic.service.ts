import { fetchTranscript } from "./transcript.service.ts";
import { evaluateInterview } from "../openai/evaluation.service.ts";
import { storeInterviewResults } from "../db/interview.service.ts";
import { updateApplicant } from "../applicant/applicant.service.ts";
import { supabase } from "../../config/supabase.config.ts";
export interface CallCriticism {
    call_id: string;
    evaluation: {
        technical_score: number;
        communication_score: number;
        overall_fit: number;
        strengths: string[];
        areas_for_improvement: string[];
        recommendation: string;
    };
    candidate_name: string;
    position: string;
    timestamp: string;
}

async function getApplicantNameFromApplicantId(applicantId: string): Promise<string> {
    console.log("Getting applicant ID from phone number:", applicantId);
    const { data: applicant, error } = await supabase
        .from('applicants')
        .select('first_name')
        .eq('id', applicantId)
        .single();
    console.log("applicant: ", applicant);
    if (error || !applicant) {
        console.error('Error fetching applicant:', error);
        throw new Error(`Applicant not found for applicantId: ${applicantId}`);
    }

    return applicant.first_name;
}

// TODO: Brandon check this out
export async function callCritic(callId: string, applicantId: string): Promise<void> {
    try {

        // 1. Fetch transcript
        const transcript = await fetchTranscript(callId);
        if (!transcript) {
            throw new Error("Failed to fetch transcript");
        }
        console.log("Finished fetching transcript")

        // 2. Evaluate interview
        const applicantName = await getApplicantNameFromApplicantId(applicantId);
        const evaluation = await evaluateInterview(transcript, applicantName);

        if (!evaluation) {
            throw new Error("Failed to evaluate interview");
        }
        console.log("Finished running evaluation")

        // 3. Store results
        console.log("Storing interview results");
        console.log(transcript);
        console.log(evaluation);
        const record = await storeInterviewResults(transcript, evaluation, applicantId);
        if (!record) {
            throw new Error("Failed to store interview results");
        }
        console.log("[Critic Service] Successfully processed interview:", record.id);

        // 4. Update applicant status
        await updateApplicant(applicantId, { status: 'interviewed' });

        // 5. Could trigger additional actions here:
        // - Send email notifications
        // - Trigger next steps in hiring process

    } catch (error) {
        console.error("[Critic Service] Error processing interview:", error);
    }
} 