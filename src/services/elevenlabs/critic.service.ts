import { fetchTranscript } from "./transcript.service.ts";
import { evaluateInterview } from "../openai/evaluation.service.ts";
import { storeInterviewResults } from "../db/interview.service.ts";

export interface CallCriticism {
    call_sid: string;
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
export async function callCritic(callSid: string): Promise<void> {
    try {
        // 1. Fetch transcript
        const transcript = await fetchTranscript(callSid);
        if (!transcript) {
            throw new Error("Failed to fetch transcript");
        }

        // 2. Evaluate interview
        const evaluation = await evaluateInterview(transcript);
        if (!evaluation) {
            throw new Error("Failed to evaluate interview");
        }

        // 3. Store results
        const record = await storeInterviewResults(callSid, transcript, evaluation);
        if (!record) {
            throw new Error("Failed to store interview results");
        }

        console.log("[Critic Service] Successfully processed interview:", record.id);

        // 4. Could trigger additional actions here:
        // - Send email notifications
        // - Update interview status
        // - Trigger next steps in hiring process

    } catch (error) {
        console.error("[Critic Service] Error processing interview:", error);
    }
} 