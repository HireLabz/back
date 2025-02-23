import { supabase } from "../../config/supabase.config.ts";
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

        const { data, error } = await supabase
            .from('interviews')
            .insert({
                call_sid: callSid,
                candidate_name: "John Doe", // TODO: Get from context
                position: "Senior Software Engineer", // TODO: Get from context
                transcript,
                evaluation
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data as InterviewRecord;
    } catch (error) {
        console.error("[DB Service] Error:", error);
        return null;
    }
} 