import { fetchTranscript } from "./transcript.service.ts";
import { evaluateInterview } from "../openai/evaluation.service.ts";
import { storeInterviewResults } from "../db/interview.service.ts";
import { updateApplicant } from "../applicant/applicant.service.ts";

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
        const evaluation = await evaluateInterview(transcript);
        if (!evaluation) {
            throw new Error("Failed to evaluate interview");
        }
        console.log("Finished running evaluation")

        // 3. Store results
        const record = await storeInterviewResults(transcript, evaluation);
        if (!record) {
            throw new Error("Failed to store interview results");
        }
        console.log("[Critic Service] Successfully processed interview:", record.id);

        // 4. Update applicant status
        await updateApplicant(applicantId, { status: 'completed' });

        // 5. Could trigger additional actions here:
        // - Send email notifications
        // - Trigger next steps in hiring process

    } catch (error) {
        console.error("[Critic Service] Error processing interview:", error);
    }
} 