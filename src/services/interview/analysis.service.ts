import { supabase } from "../../config/supabase.config.ts";

export interface CreateAnalysisData {
    interview_id: string;
    skill_name: string;
    skill_score: number;
    skill_reasoning: string;
}

export interface Analysis {
    id: string;
    interview_id: string;
    skill_name: string;
    skill_score: number;
    skill_reasoning: string;
    created_at: string;
}

export async function createAnalysis(data: CreateAnalysisData): Promise<Analysis | null> {
    try {
        // First check if interview exists
        const { data: interview, error: interviewError } = await supabase
            .from('interviews')
            .select('id')
            .eq('id', data.interview_id)
            .single();

        if (interviewError || !interview) {
            throw new Error("Interview not found");
        }

        const { data: analysis, error } = await supabase
            .from('analysis')
            .insert({
                interview_id: data.interview_id,
                skill_name: data.skill_name,
                skill_score: data.skill_score,
                skill_reasoning: data.skill_reasoning,
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        return analysis;
    } catch (error) {
        console.error("[Analysis Service] Error:", error);
        return null;
    }
}

export async function getAnalysis(analysisId: string): Promise<Analysis | null> {
    try {
        const { data, error } = await supabase
            .from('analysis')
            .select('*')
            .eq('id', analysisId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("[Analysis Service] Error:", error);
        return null;
    }
} 