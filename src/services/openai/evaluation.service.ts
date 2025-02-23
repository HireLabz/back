import type { CallTranscript } from "../elevenlabs/transcript.service.ts";

export interface InterviewEvaluation {
    technical_score: number;
    communication_score: number;
    overall_fit: number;
    strengths: string[];
    areas_for_improvement: string[];
    recommendation: string;
    detailed_feedback: string;
}

export async function evaluateInterview(transcript: CallTranscript): Promise<InterviewEvaluation | null> {
    try {
        console.log("[Evaluation Service] Analyzing interview transcript");
        // TODO: Implement actual OpenAI API call

        // Mock evaluation
        return {
            technical_score: 8.5,
            communication_score: 9.0,
            overall_fit: 8.7,
            strengths: [
                "Strong technical background",
                "Clear communication",
                "Relevant experience in similar roles"
            ],
            areas_for_improvement: [
                "Could provide more specific examples",
                "Some hesitation in system design questions"
            ],
            recommendation: "Strong candidate, recommend moving forward",
            detailed_feedback: "The candidate demonstrated strong knowledge of distributed systems..."
        };
    } catch (error) {
        console.error("[Evaluation Service] Error:", error);
        return null;
    }
} 