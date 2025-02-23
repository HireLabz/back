import { supabase } from "../../config/supabase.config.ts";
import { TranscriptMessage } from "../elevenlabs/transcript.service.ts";
import { Evaluation } from "../openai/evaluation.service.ts";


export interface InterviewRecord {
    id: string;
    created_at: string;
    applicant_id: number;
    transcript: string;
    overall_rating: number;
    summary: string;
}

export async function storeInterviewResults(
    transcript: [TranscriptMessage],
    evaluation: Evaluation,
    applicantId: string
): Promise<InterviewRecord | null> {
    try {
        console.log("[DB Service] Storing interview results");

        // const APPLICANT_ID = 21; // TODO USER ID: Ita remove hardcode

        // Do not store if interview entry already exists
        const { data } = await supabase
            .from('interviews')
            .select()
            .eq('applicant_id', applicantId)
            .maybeSingle();
        if (data) {
            return null;
        }

        const { data: interviewData, error: interviewError } = await supabase
            .from('interviews')
            .upsert({
                applicant_id: applicantId,
                transcript: transcript,
                overall_rating: evaluation.overall_rating,
                summary: evaluation.summary,
            })
            .select()
            .single();
        if (interviewError || !interviewData) {
            return null;
        }

        console.log("[DB Service] Interview stored:");

        for (const skill of evaluation.skills) {
            const { error: analysisError } = await supabase
                .from('analysis')
                .upsert({
                    interview_id: interviewData.id,
                    skill_name: skill.skill_name,
                    skill_score: skill.skill_score,
                    skill_reasoning: skill.skill_reasoning
                });
            if (analysisError) {
                return null;
            }
        }

        console.log("[DB Service] Analysis stored");

        return interviewData as InterviewRecord;
    } catch (error) {
        console.error("[DB Service] Error:", error);
        return null;
    }
} 