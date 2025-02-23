import type { TranscriptMessage } from "../elevenlabs/transcript.service.ts";
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
export interface EvaluationSkills {
    skill_name: string,
    skill_score: number,
    skill_reasoning: number
}
export interface Evaluation {
    overall_rating: number;
    summary: string;
    transcript: string; // json string
    skills: Array<EvaluationSkills>;
}

export async function evaluateInterview(transcript: [TranscriptMessage]): Promise<Evaluation | null> {
    try {
        let parsed_transcript = "";
        for (const message of transcript) {
            const role = message.role == "user" ? "Danilo" : "Eleven Labs";
            parsed_transcript += `${role}: ${message.message}\n`;
        }

        // TODO: Implement OpenAI Call

        console.log(parsed_transcript);


    } catch (error) {
        console.error("[Evaluation Service] Error:", error);
        return null;
    }
} 