import { supabase } from "../../config/supabase.config.ts";

export type ApplicantStatus = 'pending' | 'interviewing' | 'completed';

export interface UpdateApplicantData {
    status?: ApplicantStatus;
    resume_url?: string;
    linkedin_url?: string;
    portfolio_url?: string;
    github_url?: string;
}

export async function updateApplicant(
    applicantId: string,
    data: UpdateApplicantData
): Promise<any> {
    try {
        // First get current application data
        const { data: currentApplication, error: fetchError } = await supabase
            .from('applicants')
            .select('*')
            .eq('id', applicantId)
            .single();

        if (fetchError || !currentApplication) {
            throw new Error("Application not found");
        }

        // Only update fields that are provided, keep existing values for others
        const updateData = {
            status: data.status ?? currentApplication.status,
            resume_url: data.resume_url ?? currentApplication.resume_url,
            linkedin_url: data.linkedin_url ?? currentApplication.linkedin_url,
            portfolio_url: data.portfolio_url ?? currentApplication.portfolio_url,
            github_url: data.github_url ?? currentApplication.github_url,
            updated_at: new Date().toISOString()
        };

        const { data: updatedApplication, error: updateError } = await supabase
            .from('applicants')
            .update(updateData)
            .eq('id', applicantId)
            .select()
            .single();

        if (updateError) throw updateError;
        return updatedApplication;
    } catch (error) {
        console.error("[Applicant Service] Error:", error);
        throw error;
    }
} 