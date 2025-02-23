import type { InterviewEvaluation } from "../openai/evaluation.service.ts";
import type { CallTranscript } from "../elevenlabs/transcript.service.ts";

export interface InterviewRecord {
    id: string;
    call_sid: string;
    candidate_name: string;
    position: string;
    transcript: CallTranscript;
    evaluation: InterviewEvaluation;
    created_at: string;
    updated_at: string;
}

export async function storeInterviewResults(
    callSid: string,
    transcript: CallTranscript,
    evaluation: InterviewEvaluation
): Promise<InterviewRecord | null> {
    try {
        console.log("[DB Service] Storing interview results");
        // TODO: Implement actual database storage

        // Mock stored record
        return {
            id: crypto.randomUUID(),
            call_sid: callSid,
            candidate_name: "John Doe",
            position: "Senior Software Engineer",
            transcript,
            evaluation,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    } catch (error) {
        console.error("[DB Service] Error:", error);
        return null;
    }
} 