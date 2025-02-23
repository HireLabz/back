import { supabase } from "../../config/supabase.config.ts";

export interface CreateInterviewData {
    applicant_id: string;
    transcript: string;
    overall_rating: number;
    summary: string;
}

export interface Interview {
    id: string;
    applicant_id: string;
    transcript: string;
    overall_rating: number;
    summary: string;
    created_at: string;
    analysis?: Analysis[];
}

export async function createInterview(data: CreateInterviewData): Promise<Interview | null> {
    try {
        // First check if applicant exists
        const { data: applicant, error: applicantError } = await supabase
            .from('applicants')
            .select('id')
            .eq('id', data.applicant_id)
            .single();

        if (applicantError || !applicant) {
            throw new Error("Applicant not found");
        }

        const { data: interview, error } = await supabase
            .from('interviews')
            .insert({
                applicant_id: data.applicant_id,
                transcript: data.transcript,
                overall_rating: data.overall_rating,
                summary: data.summary,
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        return interview;
    } catch (error) {
        console.error("[Interview Service] Error:", error);
        return null;
    }
}

export async function getInterviewWithAnalysis(interviewId: string): Promise<Interview | null> {
    try {
        const { data, error } = await supabase
            .from('interviews')
            .select(`
                *,
                analysis (*)
            `)
            .eq('id', interviewId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("[Interview Service] Error:", error);
        return null;
    }
} 